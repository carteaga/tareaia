var cuadro_visual = function(robot_x, robot_y, objeto1_x, objeto1_y, objeto2_x, objeto2_y, objeto3_x, objeto3_y,recogido_o1,recogido_o2,recogido_o3){
    this.robot_x = ko.observable(robot_x);
    this.robot_y = ko.observable(robot_y);
    this.objeto1_x = ko.observable(objeto1_x);
    this.objeto1_y = ko.observable(objeto1_y);
    this.objeto2_x = ko.observable(objeto2_x);
    this.objeto2_y = ko.observable(objeto2_y);
    this.objeto3_x = ko.observable(objeto3_x);
    this.objeto3_y = ko.observable(objeto3_y);
    this.recogido_o1 = ko.observable(recogido_o1);
    this.recogido_o2 = ko.observable(recogido_o2);
    this.recogido_o3 = ko.observable(recogido_o3);
    this.c = ko.dependentObservable(function(){
        
        var c = new Array;
        var recogido = 0;
        if(this.recogido_o1())
            recogido++;
        if(this.recogido_o2())
            recogido++;
        if(this.recogido_o3())
            recogido++;
        for(i=1; i<=4; i++){
            c[i-1] = new Array;
            
            for(j=1; j<=4; j++){
                c[i-1][j-1] = "./imagenes/vacio.png";
                
                if(this.objeto1_x() == i && this.objeto1_y() == j){
                    c[i-1][j-1] = "./imagenes/objeto1.png";
                    
                }
                
                if(this.objeto2_x() == i && this.objeto2_y() == j){
                    c[i-1][j-1] = "./imagenes/objeto2.png";
                    
                }
                
                if(this.objeto3_x() == i && this.objeto3_y() == j){
                    c[i-1][j-1] = "./imagenes/objeto3.png";
                    
                }
                
                if(this.robot_x() == i && this.robot_y() == j){
                    c[i-1][j-1] = "./imagenes/robot-vacio.png";
                    if(recogido==1)
                        c[i-1][j-1] = "./imagenes/robot-o1.png";
                    if(recogido==2)
                        c[i-1][j-1] = "./imagenes/robot-o2.png";
                    if(recogido==3)
                        c[i-1][j-1] = "./imagenes/robot-o3.png";
                        //this.c[i-1][j-1] = "R"+recogido;
                }
            }
        }
        return c;
    },this);

};

var cuadro_nodo = function(robot_x, robot_y, objeto1_x, objeto1_y, objeto2_x, objeto2_y, objeto3_x, objeto3_y, altura,ruta,operador) {
    
    this.robot_x = parseInt(robot_x);
    this.robot_y = parseInt(robot_y);
    this.objeto1_x = parseInt(objeto1_x);
    this.objeto1_y = parseInt(objeto1_y);
    this.objeto2_x = parseInt(objeto2_x);
    this.objeto2_y = parseInt(objeto2_y);
    this.objeto3_x = parseInt(objeto3_x);
    this.objeto3_y = parseInt(objeto3_y);
    this.recogido_o1 = false;
    this.recogido_o2 = false;
    this.recogido_o3 = false;
    this.altura = parseInt(altura);
    this.expandido = false;
    this.ruta = new Array;
    var mapeo = $.map(ruta, function(oper){
        return oper;
    })
    this.ruta = mapeo;
    this.ruta.push(operador);
    this.costo = 0;
    this.g = 0;
};

/*

    Opedarores:
        - 0  : ningun operador;
        - 1  : mover Norte
        - 2  : mover Sur
        - 3  : mover Este
        - 4  : mover Oeste
                
    En la ruta se almacenan los operadores que llevan al robot a esa situacion.
*/


    


var lecturas = function() {
    this.permiso = ko.observable(true);
    this.solucion_operadores = ko.observableArray([]);
    this.metodoSeleccionado = ko.observable(1);
    this.cuadro_visible = ko.observable();
    this.cuadro_inicial = ko.observable();
    this.cuadro_solucion = ko.observable({g:0});
    this.arbol = ko.observableArray([]);
    this.ruta_solucion = ko.observableArray([]);
    this.robot_x = ko.observable(1);
    this.robot_y = ko.observable(1);
    this.objeto1_x = ko.observable(3);
    this.objeto1_y = ko.observable(1);
    this.objeto2_x = ko.observable(4);
    this.objeto2_y = ko.observable(2);
    this.objeto3_x = ko.observable(2);
    this.objeto3_y = ko.observable(4);
    this.recogido_o1 = ko.observable(false);
    this.recogido_o2 = ko.observable(false);
    this.recogido_o3 = ko.observable(false);
    this.cuadro_visible(new cuadro_visual(this.robot_x(),this.robot_y(),this.objeto1_x(),this.objeto1_y(),this.objeto2_x(),this.objeto2_y(), this.objeto3_x(), this.objeto3_y(),false,false,false));
    this.cuadro_inicial(new cuadro_nodo(this.robot_x(),this.robot_y(),this.objeto1_x(),this.objeto1_y(),this.objeto2_x(),this.objeto2_y(), this.objeto3_x(), this.objeto3_y(),0,new Array,0));
    //alert(ko.toJSON(this.niveles()));
    this.arbol.push(this.cuadro_inicial());
    this.cargar = function(){
        this.permiso(false);
        this.cuadro_inicial(new cuadro_nodo(parseInt( this.robot_x() ), parseInt( this.robot_y() ), parseInt( this.objeto1_x() ), parseInt( this.objeto1_y() )
        		, parseInt( this.objeto2_x() ), parseInt( this.objeto2_y() ), parseInt( this.objeto3_x() ), parseInt( this.objeto3_y() ),0,new Array,0));
        this.arbol.removeAll();
        this.recoger_objeto(this.cuadro_inicial());
        this.cuadro_inicial().costo = this.costo_ruta(this.cuadro_inicial());
        this.arbol.push(this.cuadro_inicial());
        this.ruta_solucion.removeAll();
        this.solucion_operadores.removeAll();
        this.cuadro_solucion({g:0});
        this.recogido_o1(false);
        this.recogido_o2(false);
        this.recogido_o3(false);
        this.cuadro_visible(new cuadro_visual(parseInt( this.robot_x() ), parseInt( this.robot_y() ), parseInt( this.objeto1_x() ), parseInt( this.objeto1_y() )
        		, parseInt( this.objeto2_x() ), parseInt( this.objeto2_y() ), parseInt( this.objeto3_x() ), parseInt( this.objeto3_y() )));
        this.recoger_objeto_visible(this.cuadro_visible());
        //alert(ko.toJSON(this));
        
        this.permiso(true);
    };
    
    this.datos_correctos = function(){
        if(this.robot_x()<=0){
            alert("La fila del robot debe ser mayor a 0");
            return false;
        }
        if(this.robot_y()<=0){
            this.robot_y(1);
            alert("La columna del robot debe ser mayor a 0");
            return false;
        }
        if(this.objeto1_x()<=0){
            alert("La fila del objeto 1 debe ser mayor a 0");
            return false;
        }
        if(this.objeto1_y()<=0){
            alert("La columna del objeto 1 debe ser mayor a 0");
            return false;
        }
        if(this.objeto2_x()<=0){
            alert("La fila del objeto 2 debe ser mayor a 0");
            return false;
        }
        if(this.objeto2_y()<=0){
            alert("La columna del objeto 2 debe ser mayor a 0");
            return false;
        }
        if(this.objeto3_x()<=0){
            alert("La fila del objeto 3 debe ser mayor a 0");
            return false;
        }
        if(this.objeto3_y()<=0){
            alert("La columna del objeto 3 debe ser mayor a 0");
            return false;
        }
        
        
        if(this.robot_x()>4){
            alert("La fila del robot debe ser menor o igual a 4");
            return false;
        }
        if(this.robot_y()>4){
            alert("La columna del robot debe ser menor o igual a 4");
            return false;
        }
        if(this.objeto1_x()>4){
            alert("La fila del objeto 1 debe ser menor o igual a 4");
            return false;
        }
        if(this.objeto1_y()>4){
            alert("La columna del objeto 1 debe menor o igual a 4");
            return false;
        }
        if(this.objeto2_x()>4){
            alert("La fila del objeto 2 debe ser menor o igual a 4");
            return false;
        }
        if(this.objeto2_y()>4){
            alert("La columna del objeto 2 debe ser menor o igual a 4");
            return false;
        }
        if(this.objeto3_x()>4){
            alert("La fila del objeto 3 debe ser menor o igual a 4");
            return false;
        }
        if(this.objeto3_y()>4){
            alert("La columna del objeto 3 debe ser menor o igual a 4");
            return false;
        }
        return true;
    };
    this.solucion = function(){
        if(this.metodoSeleccionado()==3)
            this.solucion_ida();
        else
            this.solucion_a();
    
    }
    this.solucion_a = function(){
        this.cargar();
        
        this.permiso(false);
        var largo = this.arbol().length;
        while(!this.meta()){
            //alert(ko.toJSON(this.arbol()));
            menor = this.menor_costo();
            if(!this.arbol()[menor].expandido){
                this.mover_norte(this.arbol()[menor]);
                this.mover_sur(this.arbol()[menor]);
                this.mover_este(this.arbol()[menor]);
                this.mover_oeste(this.arbol()[menor]);
                this.arbol()[menor].expandido = true;
            }
            else{
                alert("No existe una solucion posible");
                
                this.permiso(true);
                break;
                
            }
            //alert(ko.toJSON(this.arbol()));
        }
        
        //alert(ko.toJSON(this.ruta_solucion()));
        this.mostrar_solucion();
    };
    this.estado_final = function(cuadro){
        if(cuadro.recogido_o1&&cuadro.recogido_o2&&cuadro.recogido_o3){
            return true;
        }
        return false;
    
    };
    
    this.sucesores = function(cuadro){
        var suc = new Array;
        var norte = this.mover_norte(cuadro);
        if(norte){
            suc.push(norte);
        }
        var sur = this.mover_sur(cuadro);
        if(sur){
            suc.push(sur);
        }
        var este = this.mover_este(cuadro);
        if(este){
            suc.push(este);
        }
        var oeste = this.mover_oeste(cuadro);
        if(oeste){
            suc.push(oeste);
        }
        return suc;
    
    };
    
    this.DFS = function(cuadro,umbral){
        var resultado = {ruta:[],solucion:false, umbral:0};
        var ruta = [];
        //alert(cuadro);
        //console.log("altura: "+cuadro.altura+"   ("+cuadro.robot_x+","+cuadro.robot_y+","+cuadro.objeto1_x+","+cuadro.objeto1_y+","+cuadro.objeto2_x+","+cuadro.objeto2_y+","+cuadro.objeto3_x+","+cuadro.objeto3_y+","+cuadro.recogido_o1+","+cuadro.recogido_o2+","+cuadro.recogido_o3+")");
        //alert(umbral);
        if(this.estado_final(cuadro)){
            resultado.umbral = this.costo_ruta(cuadro);
            resultado.solucion = true;
            resultado.ruta = cuadro.ruta;
            this.cuadro_solucion().g = cuadro.g;
            this.cuadro_solucion.valueHasMutated();
            return resultado;
        }
        else{
        
            resultado.umbral = umbral; 
            resultado.solucion = false;
            resultado.ruta = [];
            var sucesores = this.sucesores(cuadro);
            //this.arbol.push(sucesores);
            //alert(ko.toJSON(sucesores));
            var largo = sucesores.length;
            //alert(largo);
            //alert(ko.toJSON(sucesores));
            if(!largo>0){
                return resultado;
            }
            else{
                var min_umbral = umbral;
                for(var i=0;i<largo;i++){
                    //alert("i: "+(i+1)+" largo: "+(largo));
                    var sucesor = sucesores[i];
                    var umbral_sucesor = this.costo_ruta(sucesor);
                    //alert("umbral_sucesor: "+umbral_sucesor);
                    if(umbral_sucesor > umbral){
                        //
                        //alert("umbral_sucesor: "+umbral_sucesor);
                        //alert("umbral: "+umbral);
                        
                        //alert("min umbral: "+min_umbral);
                        //console.log("alturas: "+sucesor.altura+"   ("+sucesor.robot_x+","+sucesor.robot_y+","+sucesor.objeto1_x+","+sucesor.objeto1_y+","+sucesor.objeto2_x+","+sucesor.objeto2_y+","+sucesor.objeto3_x+","+sucesor.objeto3_y+","+sucesor.recogido_o1+","+sucesor.recogido_o2+","+sucesor.recogido_o3+")");
                        if(umbral == min_umbral)
                        {
                            //alert("Son iguales: "+umbral_sucesor);
                            min_umbral = umbral_sucesor;
                            //alert("min umbral: "+min_umbral);
                        }else
                        if(umbral_sucesor < min_umbral){
                            min_umbral = umbral_sucesor;
                        }
                    
                    }
                    else{
                        var result_suc = this.DFS(sucesor,umbral);
                        //alert(ko.toJSON(result_suc)+"-------"+i + "---------------------"+ko.toJSON(sucesor) + "---------------------"+ ko.toJSON(sucesores));
                        if(result_suc.solucion){
                            resultado.solucion = true;
                            resultado.ruta = result_suc.ruta;
                            return resultado;
                        
                        }
                        else{
                            if(result_suc.umbral>umbral)
                            {
                                if(umbral == min_umbral)
                                    min_umbral = result_suc.umbral;
                                if(result_suc.umbral<min_umbral)
                                    min_umbral = result_suc.umbral;
                            
                            }
                        }
                    
                    }
                
                }
                resultado.umbral = min_umbral;
                return resultado;
            
            }
        
        
        }
    }
    
    this.solucion_ida = function(){
        this.cargar();
        
        this.permiso(false);
        var nuevo_umbral = this.costo_ruta(this.cuadro_inicial());
        //Esto es para que el umbral comience en 0
        //var nuevo_umbral = 0;
        var f_umbral = nuevo_umbral -1;
        var solucion = false;
        while(!solucion && f_umbral<nuevo_umbral){
            //alert(1);
            f_umbral = nuevo_umbral; 
            var retorna = this.DFS(this.cuadro_inicial(), f_umbral); 
            //alert(retorna);
            solucion = retorna.solucion;
            this.ruta_solucion(retorna.ruta); 
            nuevo_umbral = retorna.umbral;
            //alert("Aqui va a salir ");
            //alert("nuevo umbra: "+nuevo_umbral);
            //alert("solucion: "+solucion);
        }
        if(!solucion){
            alert("No existe una solucion posible");
            
            this.permiso(true);
            //this.cuadro_solucion().g = retorna.costo;
            
            //alert(ko.toJSON(this.arbol()));
        }
        else
        
        //alert(ko.toJSON(this.ruta_solucion()));
        this.mostrar_solucion();
    };
    

    
    this.mover_norte_visible = function(i){
        //mover a al norte
        this.solucion_operadores.push({desc_operador:"Mover al Norte",id_operador:1,numero_operacion:i});
        
        this.cuadro_visible().robot_x(this.cuadro_visible().robot_x()-1);
        
        if(this.cuadro_visible().recogido_o1())
            this.cuadro_visible().objeto1_x(this.cuadro_visible().objeto1_x()-1);
        if(this.cuadro_visible().recogido_o2())
            this.cuadro_visible().objeto2_x(this.cuadro_visible().objeto2_x()-1);
        if(this.cuadro_visible().recogido_o3())
            this.cuadro_visible().objeto3_x(this.cuadro_visible().objeto3_x()-1);
        
        this.recoger_objeto_visible(this.cuadro_visible(),i);
        this.cuadro_visible.valueHasMutated();
    };
    this.mover_sur_visible = function(i){
        //mover a al Sur
        this.solucion_operadores.push({desc_operador:"Mover al Sur",id_operador:2,numero_operacion:i});
        this.cuadro_visible().robot_x(parseInt(this.cuadro_visible().robot_x())+1);
        
        if(this.cuadro_visible().recogido_o1())
            this.cuadro_visible().objeto1_x(parseInt(this.cuadro_visible().objeto1_x())+1);
        if(this.cuadro_visible().recogido_o2())
            this.cuadro_visible().objeto2_x(parseInt(this.cuadro_visible().objeto2_x())+1);
        if(this.cuadro_visible().recogido_o3())
            this.cuadro_visible().objeto3_x(parseInt(this.cuadro_visible().objeto3_x())+1);
        
        this.recoger_objeto_visible(this.cuadro_visible(),i);
        this.cuadro_visible.valueHasMutated();
    };
    this.mover_este_visible = function(i){
        //mover a al Este
        this.solucion_operadores.push({desc_operador:"Mover al Este",id_operador:3,numero_operacion:i});
        this.cuadro_visible().robot_y(parseInt(this.cuadro_visible().robot_y())+1);
        
        if(this.cuadro_visible().recogido_o1())
            this.cuadro_visible().objeto1_y(parseInt(this.cuadro_visible().objeto1_y())+1);
        if(this.cuadro_visible().recogido_o2())
            this.cuadro_visible().objeto2_y(parseInt(this.cuadro_visible().objeto2_y())+1);
        if(this.cuadro_visible().recogido_o3())
            this.cuadro_visible().objeto3_y(parseInt(this.cuadro_visible().objeto3_y())+1);
        
        this.recoger_objeto_visible(this.cuadro_visible(),i);
        this.cuadro_visible.valueHasMutated();
    };
    this.mover_oeste_visible = function(i){
        //mover a al Oeste
        this.solucion_operadores.push({desc_operador:"Mover al Oeste",id_operador:4,numero_operacion:i});
        this.cuadro_visible().robot_y(this.cuadro_visible().robot_y()-1);
        
        if(this.cuadro_visible().recogido_o1())
            this.cuadro_visible().objeto1_y(this.cuadro_visible().objeto1_y()-1);
        if(this.cuadro_visible().recogido_o2())
            this.cuadro_visible().objeto2_y(this.cuadro_visible().objeto2_y()-1);
        if(this.cuadro_visible().recogido_o3())
            this.cuadro_visible().objeto3_y(this.cuadro_visible().objeto3_y()-1);
        
        this.recoger_objeto_visible(this.cuadro_visible(),i);
        this.cuadro_visible.valueHasMutated();
    };
    this.mostrar_solucion = function(){
        var largo = this.ruta_solucion().length;
        for(var i=0;i<largo;i++){
            if(this.ruta_solucion()[i]==1){
                setTimeout("lectViewModel.mover_norte_visible("+i+")",i*1000);
            }
            if(this.ruta_solucion()[i]==2){
                setTimeout("lectViewModel.mover_sur_visible("+i+")",i*1000);
            }
            if(this.ruta_solucion()[i]==3){
                setTimeout("lectViewModel.mover_este_visible("+i+")",i*1000);
            }
            if(this.ruta_solucion()[i]==4){
                setTimeout("lectViewModel.mover_oeste_visible("+i+")",i*1000);
            }
        };
        
        setTimeout("lectViewModel.permiso(true);",largo*1000);;
        //alert(ko.toJSON(this.cuadro_visible()));
    };
    
    this.recoger_objeto_visible = function(cuadro,i){
        if(!cuadro.recogido_o1())
            if(cuadro.robot_x()==cuadro.objeto1_x()&&cuadro.robot_y()==cuadro.objeto1_y())
            {
                cuadro.recogido_o1(true);
                this.solucion_operadores.push({desc_operador:"Recoger Objeto 1",id_operador:5,numero_operacion:i});
            }
                
        if(!cuadro.recogido_o2())
            if(cuadro.robot_x()==cuadro.objeto2_x()&&cuadro.robot_y()==cuadro.objeto2_y())
            {
                cuadro.recogido_o2(true);
                this.solucion_operadores.push({desc_operador:"Recoger Objeto 2",id_operador:5,numero_operacion:i});
            }
                
        if(!cuadro.recogido_o3())
            if(cuadro.robot_x()==cuadro.objeto3_x()&&cuadro.robot_y()==cuadro.objeto3_y())
            {
                cuadro.recogido_o3(true);
                this.solucion_operadores.push({desc_operador:"Recoger Objeto 3",id_operador:5,numero_operacion:i});
            }
    };
    
    this.meta = function(){
        var largo = this.arbol().length;
        for(i=0;i<largo;i++){
            if(this.arbol()[i].recogido_o1&&this.arbol()[i].recogido_o2&&this.arbol()[i].recogido_o3){
                this.ruta_solucion(this.arbol()[i].ruta);
                this.cuadro_solucion(this.arbol()[i]);
                return true;
            }
        }
        return false;
    };
    
    this.menor_costo = function(){
        var largo = this.arbol().length;
        var menor = 0;
        for(i=0;i<largo;i++){
            if(this.arbol()[menor].expandido&&!this.arbol()[i].expandido){
                var menor = i;
            }
            if(this.arbol()[i].costo<=this.arbol()[menor].costo&&!this.arbol()[i].expandido){
                if(this.arbol()[i].costo==this.arbol()[menor].costo)
                {
                    if(this.arbol()[i].g<this.arbol()[menor].g)
                        var menor = i;
                }
                else
                    var menor = i;
            }
        }
        return menor;
    };
    
    this.g = function(cuadro){
        //este es el costo de aplicar cualquier operador (1)
        return cuadro.g+1;
    };
    
    this.costo_ruta = function(cuadro){
        if(this.metodoSeleccionado()==1)
            return this.costo_ruta_1(cuadro);
        if(this.metodoSeleccionado()==2)
            return this.costo_ruta_2(cuadro);
        if(this.metodoSeleccionado()==3)
            return this.costo_ruta_3(cuadro);
    };
    
    this.costo_ruta_1 = function(cuadro){
        //A* con heuristica 1
        var heuristica = 0;
        if(!cuadro.recogido_o1){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto1_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto1_y);
        }
        if(!cuadro.recogido_o2){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto2_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto2_y);
        }
        if(!cuadro.recogido_o3){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto3_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto3_y);
        }
        return cuadro.g + heuristica;
    };
    this.costo_ruta_2 = function(cuadro){
        //A* con heuristica 2
        var heuristica = 0;
        heuristica += Math.abs(cuadro.robot_x-cuadro.objeto1_x);
        heuristica += Math.abs(cuadro.robot_y-cuadro.objeto1_y);
        heuristica += Math.abs(cuadro.objeto1_x-cuadro.objeto2_x);
        heuristica += Math.abs(cuadro.objeto1_y-cuadro.objeto2_y);
        heuristica += Math.abs(cuadro.objeto2_x-cuadro.objeto3_x);
        heuristica += Math.abs(cuadro.objeto2_y-cuadro.objeto3_y);
        return cuadro.g + heuristica;
    };
    this.costo_ruta_3 = function(cuadro){
        var heuristica = 0;
        if(!cuadro.recogido_o1){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto1_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto1_y);
        }
        if(!cuadro.recogido_o2){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto2_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto2_y);
        }
        if(!cuadro.recogido_o3){
            heuristica += Math.abs(cuadro.robot_x-cuadro.objeto3_x);
            heuristica += Math.abs(cuadro.robot_y-cuadro.objeto3_y);
        }
        return cuadro.g + heuristica;
    
    };
    
    this.recoger_objeto = function(cuadro){
        if(!cuadro.recogido_o1)
            if(cuadro.robot_x==cuadro.objeto1_x&&cuadro.robot_y==cuadro.objeto1_y)
                cuadro.recogido_o1 = true;
                
        if(!cuadro.recogido_o2)
            if(cuadro.robot_x==cuadro.objeto2_x&&cuadro.robot_y==cuadro.objeto2_y)
                cuadro.recogido_o2 = true;
                
        if(!cuadro.recogido_o3)
            if(cuadro.robot_x==cuadro.objeto3_x&&cuadro.robot_y==cuadro.objeto3_y)
                cuadro.recogido_o3 = true;
    };
    
    this.mover_este = function(cuadro){
        if(cuadro.robot_y<4&&this.verificar_orden(cuadro.robot_x,cuadro.robot_y+1, cuadro)){
            var objeto1_y = cuadro.objeto1_y;
            var objeto2_y = cuadro.objeto2_y;
            var objeto3_y = cuadro.objeto3_y;
            
            if(cuadro.recogido_o1)
                objeto1_y = parseInt(cuadro.objeto1_y)+1;
                
            if(cuadro.recogido_o2)
                objeto2_y = parseInt(cuadro.objeto2_y)+1;
                
            if(cuadro.recogido_o3)
                objeto3_y = parseInt(cuadro.objeto3_y)+1;
                
                                    
            nuevo_cuadro = new cuadro_nodo(cuadro.robot_x,cuadro.robot_y+1,cuadro.objeto1_x,objeto1_y,cuadro.objeto2_x,objeto2_y, cuadro.objeto3_x, objeto3_y,cuadro.altura+1,cuadro.ruta,3);
            this.recoger_objeto(nuevo_cuadro);
            nuevo_cuadro.g = this.g(cuadro);
            nuevo_cuadro.costo = this.costo_ruta(nuevo_cuadro);
            this.arbol.push(nuevo_cuadro);
            return nuevo_cuadro;
            
        }
        
        
    };
    this.mover_oeste = function(cuadro){
        if(cuadro.robot_y>1&&this.verificar_orden(cuadro.robot_x,cuadro.robot_y-1, cuadro)){
            var objeto1_y = cuadro.objeto1_y;
            var objeto2_y = cuadro.objeto2_y;
            var objeto3_y = cuadro.objeto3_y;
            
            if(cuadro.recogido_o1)
                objeto1_y = parseInt(cuadro.objeto1_y)-1;
                
            if(cuadro.recogido_o2)
                objeto2_y = parseInt(cuadro.objeto2_y)-1;
                
            if(cuadro.recogido_o3)
                objeto3_y = parseInt(cuadro.objeto3_y)-1;
                    
            nuevo_cuadro = new cuadro_nodo(cuadro.robot_x,cuadro.robot_y-1,cuadro.objeto1_x,objeto1_y,cuadro.objeto2_x,objeto2_y, cuadro.objeto3_x, objeto3_y,cuadro.altura+1,cuadro.ruta,4);
            this.recoger_objeto(nuevo_cuadro);
            nuevo_cuadro.g = this.g(cuadro);
            nuevo_cuadro.costo = this.costo_ruta(nuevo_cuadro);
            this.arbol.push(nuevo_cuadro);
            return nuevo_cuadro;
            
        }
        
        
    };
    
    this.mover_sur = function(cuadro){
        if(cuadro.robot_x<4&&this.verificar_orden(cuadro.robot_x+1,cuadro.robot_y, cuadro)){
            var objeto1_x = cuadro.objeto1_x;
            var objeto2_x = cuadro.objeto2_x;
            var objeto3_x = cuadro.objeto3_x;
            if(cuadro.recogido_o1)
                objeto1_x = parseInt(cuadro.objeto1_x)+1;
                
            if(cuadro.recogido_o2)
                objeto2_x = parseInt(cuadro.objeto2_x)+1;
                
            if(cuadro.recogido_o3)
                objeto3_x = parseInt(cuadro.objeto3_x)+1;
                
            nuevo_cuadro = new cuadro_nodo(cuadro.robot_x+1,cuadro.robot_y,objeto1_x,cuadro.objeto1_y,objeto2_x,cuadro.objeto2_y, objeto3_x, cuadro.objeto3_y,cuadro.altura+1,cuadro.ruta,2);
            this.recoger_objeto(nuevo_cuadro);
            nuevo_cuadro.g = this.g(cuadro);
            nuevo_cuadro.costo = this.costo_ruta(nuevo_cuadro);
            this.arbol.push(nuevo_cuadro);
            return nuevo_cuadro;
            
        }
        
        
    };
    
    
    this.mover_norte = function(cuadro){
        if(cuadro.robot_x>1&&this.verificar_orden(cuadro.robot_x-1,cuadro.robot_y, cuadro)){
            var objeto1_x = cuadro.objeto1_x;
            var objeto2_x = cuadro.objeto2_x;
            var objeto3_x = cuadro.objeto3_x;
            
            if(cuadro.recogido_o1)
                objeto1_x = parseInt(cuadro.objeto1_x)-1;
                
            if(cuadro.recogido_o2)
                objeto2_x = parseInt(cuadro.objeto2_x)-1;
                
            if(cuadro.recogido_o3)
                objeto3_x = parseInt(cuadro.objeto3_x)-1;
            
            nuevo_cuadro = new cuadro_nodo(cuadro.robot_x-1,cuadro.robot_y,objeto1_x,cuadro.objeto1_y,objeto2_x,cuadro.objeto2_y, objeto3_x, cuadro.objeto3_y,cuadro.altura+1,cuadro.ruta,1);
            this.recoger_objeto(nuevo_cuadro);
            nuevo_cuadro.g = this.g(cuadro);
            nuevo_cuadro.costo = this.costo_ruta(nuevo_cuadro);
            this.arbol.push(nuevo_cuadro);
            return nuevo_cuadro;
            
        }
        
        
    };
    
                    
    this.verificar_orden = function(robot_x, robot_y, cuadro){
        if(robot_x==cuadro.objeto2_x&&robot_y==cuadro.objeto2_y&&!cuadro.recogido_o1)
            return false;
        if(robot_x==cuadro.objeto3_x&&robot_y==cuadro.objeto3_y&&!cuadro.recogido_o2)
            return false;
        return true;
    };
    
    
   
};