//READ ME:
//Si se desea hacer cambios esteticos en:
//Editor grafico del circuito: 
//  -Si desea cambiar la manera en que se representa cada elemento , puede editar la funcion actualizarDiagrama en la clase interfaz en el apartado DIBUJO
//Distribucion de la interfaz grafica:  
//  -editar con criterio el archivo HTML
//
//PARA LA ITERACION 70%:
//funcionalidad de borrado de compuerta , cambio , no con estilo de herramienta
//camnbios graficos
//Simular uno a uno (input) , todos a todos , algunos a algunos (a travez de txt , con errores)
//prompt de salida
// S1 , .qt carga descarga , nombre
//FUNCIONES BASICAS:
///PAULIX
function X(a) {
  let real = a.re; // Separa la parte real del qubit
  let imag = a.im; // Separa la parte imaginaria del qubit 
  if (real !== 0) { // Compara si la parte real del qubit es diferente de 0 por si entra -1
    real = 0; // Hace la operacion del qubit en caso de que entre un 1 o -1
  } else if (real === 0) { // Compara si la parte real del qubit es igual a 0
    real = 1; // Si entra un 0 lo cambia a 1
  }
  a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
  return a;
}
///PAULIY
function Y(a) {
  let real = a.re; // Separa la parte real del qubit
  let imag = a.im; // Separa la parte imaginaria del qubit
  if (real === 0 && imag === 0) { // Si la parte real es 0 y la imaginaria es 0
    imag = 1; // La parte real es 0
  } else if (real === 0 && imag !== 0) { // Si la parte real es 0 y la imaginaria es diferente de 0
    imag = math.multiply(imag, 1); // El imaginario se multiplica por 1
  } else if (real !== 0 && imag === 0) { // Si la parte real es diferente de 0 (por si entra -1) y la imaginaria es 0
    imag = -1; // El imaginario es -1
  } else if (real !== 0 && imag !== 0) { // Si la parte real es diferente de 0 (por si entra -1) y la imaginaria es diferente de 0
    imag = math.multiply(imag, -1); // El imaginario se multiplica por -1
  }
  a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
  return a;
}
///PAULIZ
function Z(a) {
  let real = a.re; // Separa la parte real del qubit
  let imag = a.im; // Separa la parte imaginaria del qubit
  if (real === 0) { // Si la parte real es 0
    real = 0; // La parte real sera 0
  } else if (real !== 0) { // Si la parte real es diferente a 1
    real = math.multiply(real, -1); // La parte real cambirara de signo al multiplicarla por -1
  }
  a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
  return a;
}
// Cambio de fase
function P(a, angulo) {
  let real = a.re; // Obtiene la parte real del qubit
  if (real == 0) { // Si el valor del qubit es igual a 0
    real = 0; // El valor del qubit se mantiene en 0
  } else if (real != 0) { // Si el valor del qubit es diferente de 0 se calculará el valor del qubit con el cambio de fase
    let radang = math.unit(angulo, 'deg').toNumber('rad'); // Convertimos de ángulo a radianes
    let fase = math.multiply(math.cos(radang), math.complex(0, math.sin(radang))); // Se calcula la fase utilizando la formula de Euler
    a = math.multiply(a, fase);
  }
  return a;
}
// Hadamard
function H(a) {
  let real = a.re; // Obtiene la parte real del qubit
  let imag = a.im; // Obtiene la parte imaginaria del qubit
  if (real == 0) { // Si el valor del qubit es igual a 0
    real = 1 / math.sqrt(2); // El valor del qubit 1/la raiz de 2
  } else if (real != 0) { // Si el valor del qubit es diferente de 0
    real = -1 / math.sqrt(2); // El valor del qubit 1/la raiz de 2
  }
  a = math.complex(real, imag); // Reconstruye el qubit con los nuevos valores
  return a;
}
/////CONTROL/////
function CONTROL(entradas){
  for (const entrada of entradas) {
    console.log("XXX:",entrada)
    if(entrada.re == 0){
      return false;
    }  
  }
  return true;
}
///////////////////
function print(numero){
  if (typeof numero === 'object' && numero.re != null && numero.im != null) {
      console.log(numero.re + (numero.im >= 0 ? '+' : '') + numero.im + 'j');
  } else {
    console.log(numero);
  }
}
function complejo(numero){
  return `(${numero.re}${(numero.im>=0)?'+':''}${numero.im}i)`
}
function complejos(numeros){
  let r = ''
  for (let index = 0; index < numeros.length; index++) {
    
    r=r+complejo( numeros[index])+"  ";
  }
  return r
}

///////////CLASES:///////////
class circuitoMatriz{
  estado={
  matriz : [[]],
  qubits : 0 ,
  final : 0,
  finales : []
  }
  /////////////////////////////////
  formato(str) {
    if (str.length < 5) {
      let diff = 5 - str.length;
      let dashes = '-'.repeat(diff);
      return str.concat(dashes);
    } else {
      return str;
    }
  }
  /////////////////////////////////
  constructor(numero){
    this.setQubits(numero);
  }
  ////////////////////////////////
  setEstado(estado){
    this.estado = structuredClone(estado)
  }
  getEstado(){
    return structuredClone(this.estado)
  }
  setQubits(numero){
    this.estado.qubits = numero;
    this.estado.final=0;
    for (let i = 0; i < this.estado.qubits; i++) {     
      this.estado.matriz[i]=['-'];      
      this.estado.finales[i]=0;
    }
    return true;
  }
  aumentarQbit(){
    this.estado.qubits++;
    this.estado.matriz[this.estado.qubits-1]=[]
    for (let i = 0; i <= this.estado.final; i++){
      this.estado.matriz[this.estado.qubits-1][i]='-';
    }
    return true;
  }
  borrarConecciones(){
    for (let i = 0; i <= this.estado.final; i++){
      for (let j = 0; j < this.estado.qubits; j++){
        if(this.estado.matriz[j][i][0]=='C'){
          let objetivo = this.estado.matriz[j][i].slice(1)/1;
          if(!this.esCompuerta(objetivo,i)){
            for (let k = 0; k < this.estado.qubits; k++){
              this.estado.matriz[k][i]='-';
            }
            break;
          }
        }
      }
    }
  }
  decrementarQbit(){
    this.estado.qubits--;
    this.estado.matriz.pop();
    this.borrarConecciones();
    return false;
  }
  operador(op,qubit,lugar){
    console.log(op,qubit,lugar)
    if(this.estado.matriz[qubit][lugar]=='-'){
      if(this.lineaConectada(lugar)){
        this.lineaNueva(lugar);
        this.operador(op,qubit,lugar) 
      }
      this.estado.matriz[qubit][lugar]=op;
      if(lugar == this.estado.final){
        this.anadirLinea();
      }
      return true;
    }else if (this.estado.matriz[qubit][lugar]!=undefined){
      this.lineaNueva(lugar);
      this.operador(op,qubit,lugar)      
    }
    return false;
  }
  lineaConectada(lugar){
    for (let j = 0; j < this.estado.qubits; j++){
      if(this.estado.matriz[j][lugar][0]=='C'){
        return true;
      }
    }
    return false;
  }
  lineaNueva(lugar){
    /////TODO verificaciones
    for (let i = 0; i < this.estado.qubits; i++) {     
      this.estado.matriz[i].splice(lugar,0,'-')
    }
    this.estado.final++;
    return true;
  }
  esCompuerta(qubit,linea){
    if(this.estado.matriz[qubit]==undefined){
      return false;
    }
    if(this.estado.matriz[qubit][linea]==undefined){
      return false;
    }
    if(this.estado.matriz[qubit][linea]=='-'){
      return false;
    }
    return this.estado.matriz[qubit][linea][0]!='C';
  }
  lineaAptaParaConectar(linea){
    let c=0;
    for (let i = 0; i < this.estado.qubits; i++) {     
      if(!this.esCompuerta(i,linea)){
        c++;
      }
    }
    return c==(this.estado.qubits-1);
  }
  hacerAptaParaConectar(qubit, lugar){
    if(this.lineaAptaParaConectar(lugar)){
      return false;
    }
    if(!this.esCompuerta(qubit,lugar)){
      return false;
    }
    for (let i = 0; i < this.estado.qubits; i++) {     
      this.estado.matriz[i].splice(lugar,0,'-')
    }
    this.estado.matriz[qubit][lugar]=this.estado.matriz[qubit][lugar+1];
    this.estado.matriz[qubit][lugar+1]='-';
    this.estado.final++;
    return true;
  }
  conector(qubit,lugar,objetivo){    
    if(qubit==objetivo){
      return false;
    }
    if(this.lineaAptaParaConectar(lugar)){
      console.log("linea apta")
      if(this.esCompuerta(objetivo,lugar)){
        this.estado.matriz[qubit][lugar]='C'+objetivo;
        return true;
      }
    }else{  
      this.hacerAptaParaConectar(objetivo,lugar);
      this.conector(qubit,lugar,objetivo)
    }
  }
  borrarElemento(qubit,lugar){
    if(this.estado.matriz[qubit]==undefined){
      console.log("111111111")
      return false;
    }
    if(this.estado.matriz[qubit][lugar]==undefined){
      console.log("2222222222")
      return false;
    }
    this.estado.matriz[qubit][lugar]="-";
    this.borrarConecciones();
    return true;
  }
  borrarlinea(linea){    

  }
  lineaVacia(linea){
    for (let i = 0; i < this.estado.qubits; i++) {     
      if(this.estado.matriz[i][linea]!='-' ){
        return false;
      }
    }
    return true;
  }
  anadirLinea(){
    for (let i = 0; i < this.estado.qubits; i++) {     
      this.estado.matriz[i][this.estado.final+1]='-';
    }
    this.estado.final++;
    return true;
  }
  quitarLinea(){
    for (let i = 0; i < this.estado.qubits; i++) {     
      this.estado.matriz[i].pop()
    }
    this.estado.final--;
    return true;
  }
  mostrar(){
    let salida='MATRIZ:\n';
    for (let i = 0; i < this.estado.qubits; i++) {    
      for (let j = 0; j <= this.estado.final; j++){
        salida=salida+this.formato(this.estado.matriz[i][j]);
      } 
      salida=salida+'\n'
    }
    console.log(salida);
  }  
  generar(codigo){    
    let instrucciones = codigo.split(';');
    for (let i = 0; i < instrucciones.length; i++) {      
      instrucciones[i]=instrucciones[i].trim();
      instrucciones[i]=instrucciones[i].split(' ');
      for (let j = 0; j < instrucciones[i].length; j++) {
        instrucciones[i][j]=instrucciones[i][j].trim();
      }  
    }
    console.log(instrucciones);
    for (let i = 0; i < instrucciones.length; i++) {  
      if(1<instrucciones[i].length){
        if(instrucciones[i][0]=='qbits'){
          this.setQubits(instrucciones[i][1]/1);
        }else if(instrucciones[i][0][0]!='C'){
          let qbit = (instrucciones[i][1].slice(1))/1;
          let lugar = this.estado.finales[qbit];
          let op = instrucciones[i][0];
          this.estado.finales[qbit]++;
          console.log("PUERTA:",op,qbit,lugar);
          this.operador(op,qbit,lugar);
        }else if(instrucciones[i][0][0]=='C'){
          let objetivo = (instrucciones[i][1].slice(1))/1;
          let lugar = this.estado.final;
          let op = instrucciones[i][0].slice(1);
          let controles = instrucciones[i].slice(2);
          this.operador(op,objetivo,lugar);
          for (let j = 0; j < controles.length; j++) {
            let q =  (controles[j].slice(1))/1; 
            console.log("C:",q,lugar,objetivo); 
            this.conector(q,lugar,objetivo); 
          }
          for (let index = 0; index < this.estado.finales.length; index++) {
            this.estado.finales[index]= this.estado.final;
            
          }
          //console.log(objetivo,lugar,op,controles);
         
        }
      }
    }   
  }
  generarCodigo(){
    let codigo = "qbits "+this.estado.qubits+";\n";
    for (let i = 0; i <= this.estado.final; i++) {
      //Verificar conecciones:
      let noHayConecciones = true;
      for (let j = 0; j < this.estado.qubits; j++) {
        if(this.estado.matriz[j][i][0]=='C'){
          noHayConecciones = false;
          break;
        }
      }
      if(noHayConecciones){
        for (let j = 0; j < this.estado.qubits; j++) {
          if(this.estado.matriz[j][i][0]!='-'){
            codigo = codigo+this.estado.matriz[j][i]+" "+"q"+j+";\n";
          }
        }
      }else{
        let conecciones=[]
        let objetivo=-1
        let operador = ""
        for (let j = 0; j < this.estado.qubits; j++) {
          if(this.estado.matriz[j][i][0]=='C'){
            objetivo = this.estado.matriz[j][i].slice(1)/1
            conecciones.push(j);
          }else if(this.estado.matriz[j][i][0]!='-'){            
            operador= this.estado.matriz[j][i]
          }       
        }
        codigo = codigo+"C"+operador+" "+"q"+objetivo+"";
        for (let index = 0; index < conecciones.length; index++) {
          codigo=codigo+" q"+conecciones[index]+"";          
        }
        codigo=codigo+";\n";
      }
      //      
    }
    return codigo;
  }
}
////////////////////////////////
class ComandoXYZHP{
  qbit=null;
  circuito=null;
  compuerta='X';
  constructor(qbit,circuito,compuerta){
    this.qbit=qbit;
    this.circuito=circuito;
    this.compuerta=compuerta;
  }
  ejecutar(log){
    if(this.compuerta=='X'){
      this.circuito.entradas[this.qbit]=X(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='Y'){
      this.circuito.entradas[this.qbit]=Y(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='Z'){
      this.circuito.entradas[this.qbit]=Z(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='H'){
      this.circuito.entradas[this.qbit]=H(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta[0]=='P'){
      let fase = this.compuerta.slice(1)/1;
      this.circuito.entradas[this.qbit]=P(this.circuito.entradas[this.qbit],fase);
    }else if(this.compuerta=='M' && log===true){
      this.circuito.interfaz.log("q"+this.qbit+": "+this.circuito.entradas[this.qbit] )
    }
  }
}
class ComandoControlXYZHP{
  qbit=null;
  circuito=null;
  compuerta='X';
  controles=null;
  constructor(qbit,circuito,compuerta,controles){
    this.qbit=qbit;
    this.circuito=circuito;
    this.compuerta=compuerta;
    this.controles=controles;
  }
  ejecutar(log){
    let controles =[];
    for (const control of this.controles) {
      controles[controles.length]=this.circuito.entradas[control];
    }
    console.log(this.controles)
    console.log(controles)
    console.log(this.circuito.entradas)
    if(!CONTROL(controles)){
      console.log("FALSO")
      return;
    }
    if(this.compuerta=='X'){
      this.circuito.entradas[this.qbit]=X(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='Y'){
      this.circuito.entradas[this.qbit]=Y(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='Z'){
      this.circuito.entradas[this.qbit]=Z(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta=='H'){
      this.circuito.entradas[this.qbit]=H(this.circuito.entradas[this.qbit]);
    }else if(this.compuerta[0]=='P'){
      let fase = (this.compuerta.slice(1))/1;
      this.circuito.entradas[this.qbit]=P(this.circuito.entradas[this.qbit],fase);
    }else if(this.compuerta=='M'&& log===true){
      this.circuito.interfaz.log("q"+this.qbit+": "+this.circuito.entradas[this.qbit] )
    }
  }
  
}

class Circuito{
  entradas=[];
  comandos=[];
  qubits=0;
  constructor(entradas,interfaz){
    this.setEntradas(entradas);
    this.interfaz = interfaz;
  }
  setEntradas(entradas){
    this.entradas=entradas;
  }
  reiniciarComando(){
    this.comandos=[];
    this.qubits=0;
    this.entradas=[];
  }
  ingresarComando(comando){
    this.comandos[this.comandos.length]=comando;
  }
  ejecutar(log){
    console.log("COMANDOS: ",this.comandos)
    for (const comando of this.comandos) {
      comando.ejecutar(log);
    } 
  }

  generar(codigo){    
    //let tok = this.dividirTexto(codigo);
    //console.log("tokens:",tok);
    //let tokken = this.tokkens(tok)
    //console.log("tipos:",tokken);
    ////////////////////////////
    let instrucciones = codigo.split(';');
    for (let i = 0; i < instrucciones.length; i++) {      
      instrucciones[i]=instrucciones[i].trim();
      instrucciones[i]=instrucciones[i].split(' ');
      for (let j = 0; j < instrucciones[i].length; j++) {
        instrucciones[i][j]=instrucciones[i][j].trim();
      }  
    }
    console.log("instrucciones:",instrucciones);
    /////////////////////////////
    for (let i = 0; i < instrucciones.length; i++) {  
      if(1<instrucciones[i].length){
        console.log(instrucciones[i])
        if(instrucciones[i][0]=='qbits'){
          this.qubits = instrucciones[i][1]/1;
          console.log(this.qubits)
        }else if(instrucciones[i][0][0]!='C'){
          let qbit = (instrucciones[i][1].slice(1))/1;
          let op = instrucciones[i][0];
          console.log("PUERTA:",op,qbit);
          this.ingresarComando(new ComandoXYZHP(qbit,this,op));
        }else /*if(instrucciones[i][0][0]=='C')*/{
          let objetivo = (instrucciones[i][1].slice(1))/1;
          let op = instrucciones[i][0].slice(1);
          let controles = instrucciones[i].slice(2);
          for (let j = 0; j < controles.length; j++) {
            controles[j] =  (controles[j].slice(1))/1; 
          }
          console.log("CONTROLES: ",objetivo,op,controles);
          this.ingresarComando(new ComandoControlXYZHP(objetivo,this,op,controles));
        }
      }
    }   
  }  

  generarTodasLasEntradas(){
    // Calcular el número de filas en la matriz
    let N = this.qubits;
    const filas = 2 ** N;
      
    // Crear una matriz vacía de tamaño filas x N
    const matriz = new Array(filas).fill(null).map(() => new Array(N).fill(0));

    // Iterar sobre todas las filas y columnas de la matriz
    for (let fila = 0; fila < filas; fila++) {
      for (let col = 0; col < N; col++) {
        // Comprobar si el bit correspondiente en el número de fila es 1 o 0
        if ((fila >> col) & 1) {
          matriz[fila][col] = 1;
        }
      }
    }
    return matriz;
  }
}
///////////////////////////////
class interfaz{
  matriz= new circuitoMatriz(3);
  //////////
  historial=[];
  maximo=20;
  //////////
  div=null;
  estado=null;// 1=compuerta , 2 = conectorA , 3 = conectorB
  operador=null;// "XYZHPxxx"
  seleccionadoParaConectar = null ;
  //////////
  X=50;
  Y=50;
  Wcanvas=400;///espacio util
  Hcanvas=300;///espacio util
  WcanvasMin=400;///espacio util
  HcanvasMin=300;///espacio util
  w=50;
  h=50;
  espacio = 10
  //////////
  constructor(contenedor,canvas,ctx,capa,ctxCapa,bdiagramaCodigo,bcodigoDiagrama,codigo
    ,X,Y,Z,H, M ,P,iP,C,Mas,Menos
    ,consola ,inputs, ejecutar 
    ,generarTabla , archivo , generarResultados,
    circuito,updateLineNumbers){
    this.updateLineNumbers=updateLineNumbers;
    this.circuito = new Circuito(3,this);

    this.consola=consola;
    this.inputs=inputs;
    this.ejecutar=ejecutar;
    this.generarTabla=generarTabla;
    this.archivo=archivo;
    this.generarResultados=generarResultados;

    this.contenedor=contenedor;
    this.capa=capa;
    this.ctxCapa = ctxCapa;
    this.canvas=canvas;
    this.ctx = ctx;
    this.bdiagramaCodigo=bdiagramaCodigo
    this.bcodigoDiagrana=bcodigoDiagrama
    this.codigo=codigo

    this.Wcanvas = canvas.width
    this.Hcanvas = canvas.height
    this.WcanvasMin = canvas.width
    this.HcanvasMin = canvas.height
    this.esatadoActual= this.matriz.getEstado();

    generarTabla.addEventListener("click",()=>{
      this.generarTodasLasSalidas();
    })

    ejecutar.addEventListener("click",()=>{
      this.simular();
    })

    generarResultados.addEventListener("click",()=>{     
      archivo.value = null 
      archivo.click();
    })
    archivo.addEventListener("input", ()=> {
      this.simularMultiple();
      console.log(21321221322312)
    })


    bdiagramaCodigo.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.diagramaCodigo();
      this.updateLineNumbers()
    })
    bcodigoDiagrama.addEventListener("click",(evt)=>{   
      if(this.div != null){
        this.div.remove();
        this.div = null;
      } 
      this.codigoDiagrama();
    })
    document.addEventListener("keypress",(evt)=>{
      if(evt.key!="Enter"){
        return;
      }
      if(this.div != null){
        this.div.remove();
        this.div = null;
      } 
      console.log(evt)
      this.estado=null;
      this.operador=null;
      this.seleccionadoParaConectar = null ;
      this.matriz.setEstado(this.esatadoActual)
      this.actualizarDiagrama();
    })
  
    capa.addEventListener("mousemove",(evt)=>{      
      this.sobreElDiagrama(evt.offsetX,evt.offsetY)
    })
    
    capa.addEventListener("click",(evt)=>{
      console.log("click:",evt.offsetX,evt.offsetY)
      this.clickEnDiagrama(evt.offsetX,evt.offsetY)
    })
    
    M.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"M")
    })
    
    X.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"X")
    })
    Y.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"Y")
    })
    Z.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"Z")
    })
    P.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      let numero = (iP.value)/1
      this.cambiarEstado(1,"P"+numero)
    })
    H.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(1,"H")
    })
    C.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(2,null)
    })
    Mas.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.cambiarEstado(null,null)
      this.aumentarQubits();
    })
    Menos.addEventListener("click",(evt)=>{
      if(this.div != null){
        this.div.remove();
        this.div = null;
      }
      this.decrementarQubits();
      this.cambiarEstado(null,null)
    })
    /////
    this.actualizarDiagrama()
  }
  descargarTextoComoArchivo(nombreArchivo, texto) {

    const elementoAncla = document.createElement("a");

    const textoBlob = new Blob([texto], { type: "text/plain" });
  
    const urlArchivo = window.URL.createObjectURL(textoBlob);

    elementoAncla.href = urlArchivo;
  
    elementoAncla.download = nombreArchivo;

    elementoAncla.click();
  
    window.URL.revokeObjectURL(urlArchivo);
  }

  log(txt){
    this.consola.value = this.consola.value + "\nSystem: \n"+txt+"\n";
    this.consola.scrollTop = this.consola.scrollHeight;
  }
  
  simularMultiple(){
    const file = this.archivo.files[0];
    const reader = new FileReader();
    this.circuito.reiniciarComando();
    this.circuito.generar(this.codigo.value);
    reader.onload = () => {
      const lineBreak = reader.result.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
      let lineas = reader.result.split(lineBreak);
      
      for (let index = 0; index < lineas.length; index++) {
        lineas[index]= lineas[index].split(',');
        if(lineas[index].length!=this.circuito.qubits){
          this.log("ERROR DE ENTRADAS: el numero de qbits en el archivo de entrada debe ser igual al del circuito, revise el comando qubits x;")
          return;
        }
        for (let index2 = 0; index2 < lineas[index].length; index2++) {
          let num2 = ((lineas[index][index2].trim())/1)**2;
          let num1 = 1-num2;
          lineas[index][index2] = math.complex(num1,num2);
        }
      }
      let res = "";
      
      for (let i = 0; i < lineas.length; i++) {
        this.circuito.setEntradas(lineas[i]);
        this.circuito.ejecutar();
        console.log("RESULTADO: "+complejos(this.circuito.entradas))
        res=res+complejos(this.circuito.entradas)+"\n";
      }
      this.descargarTextoComoArchivo("resultado.txt",res)
      this.log("RESULTADO: \n"+res)
    }
    reader.readAsText(file);
  }
  simular(){
    this.circuito.reiniciarComando();
    this.circuito.generar(this.codigo.value);
    let entradas = (this.inputs.value).split(',')
    if(entradas.length!=this.circuito.qubits){
      this.log("ERROR DE ENTRADA: el numero de qbits en la entrada debe ser igual al del circuito, revise el comando qubits x;")
      return;
    }
    for (let index = 0; index < entradas.length; index++) {
      let num2 = ((entradas[index].trim())/1)**2;
      let num1 = 1-num2;
      entradas[index] = math.complex(num1,num2);
      // TODO 
    }
    console.log(entradas);
    
    this.circuito.setEntradas(entradas);
    this.circuito.ejecutar(true);
    console.log((this.circuito.entradas))
    console.log(complejos(this.circuito.entradas))
    this.log(complejos(this.circuito.entradas))

  }
  generarTodasLasSalidas(){
    let res = "";
    this.circuito.reiniciarComando();
    this.circuito.generar(this.codigo.value);
    let lineas = this.circuito.generarTodasLasEntradas();
    for (let index = 0; index < lineas.length; index++) {
      for (let index2 = 0; index2 < lineas[index].length; index2++) {
        let num2 = (lineas[index][index2])**2;
        let num1 = 1-num2;
        lineas[index][index2] = math.complex(num1,num2);
      }
    }
    console.log(lineas)
    for (let i = 0; i < lineas.length; i++) {
      this.circuito.setEntradas(lineas[i]);
      this.circuito.ejecutar();
      console.log("RESULTADO: "+complejos(this.circuito.entradas))
      res=res+complejos(this.circuito.entradas)+"\n";
    }
    this.descargarTextoComoArchivo("resultado.txt",res)
    this.log("Tabla de verdad:\n"+res)
  }
  aumentarQubits(){
    this.matriz.aumentarQbit();
    this.esatadoActual=this.matriz.getEstado();
    this.actualizarDiagrama();
  }
  decrementarQubits(){
    this.matriz.decrementarQbit();
    this.esatadoActual=this.matriz.getEstado();
    this.actualizarDiagrama();
  }

  cambiarEstado(estado, operador){
    this.estado=estado;
    this.operador=operador;
  }
  traductorXY(x,y){
    let casillasW= this.matriz.estado.final+1;
    let casillasH= this.matriz.estado.qubits;
    let rx = parseInt((x-this.X)/this.w);
    let ry = parseInt((y-this.Y)/(this.h+this.espacio));

    if(rx<0){
      return null;
    }
    if(casillasW<=rx){
      return null;
    }
    if(ry<0 ){
      return null;
    }
    if(casillasH<=ry ){
      return null;
    }
    
    return {X:rx,Y:ry}
  }
  sobreElDiagrama(x,y){
    this.ctxCapa.clearRect(0,0,this.Wcanvas,this.Hcanvas);
    let click = this.traductorXY(x,y);
    
    if(this.estado==1){      
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){

        this.colocarCompuerta(this.operador,click.Y,click.X);
      }      
      this.actualizarDiagrama();
      this.dibujarCompuerta(this.ctxCapa,this.operador,x,y); 
    } 
    /*
    conectarA(qubit,lugar){
      this.seleccionadoParaConectar=qubit
      this.matriz.hacerAptaParaConectar(qubit,lugar)   
      this.cambiarEstado(3,null); 
    }
    conectarB(qubit,lugar){
      this.matriz.conector(qubit,lugar,this.seleccionadoParaConectar);
      this.cambiarEstado(null,null); 
    }
    */
    if(this.estado==2){ 
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.matriz.hacerAptaParaConectar(click.Y,click.X)  
        this.seleccionadoParaConectar=click.Y
      }      
      this.actualizarDiagrama();
      /*
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.conectarA(click.Y,click.X);
      }      
      this.actualizarDiagrama();
      */
      this.dibujarCompuerta(this.ctxCapa,'C',x,y);
    }  
    if(this.estado==3){ 
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.matriz.conector(click.Y,click.X,this.seleccionadoParaConectar);
      }      
      this.actualizarDiagrama();
      /*
      console.log(x,y)           
      this.matriz.setEstado(this.esatadoActual);
      if(click!=null){
        this.conectarA(click.Y,click.X);
      }      
      this.actualizarDiagrama();
      */
      this.dibujarCompuerta(this.ctxCapa,'*',x,y);
    }    
    //this.actualizarDiagrama();
  }
  dibujarCompuerta(capa,op,X,Y){    
    capa.fillStyle = "white";  
    capa.strokeStyle = "#66869a";  
    capa.lineWidth = 4;
    capa.fillRect(X,Y,this.w*0.8,this.h);    
    capa.strokeRect(X,Y,this.w*0.8,this.h);
    capa.fillStyle = "#66869a"; 
    capa.font = "bold 20px Arial";
    var textWidth = capa.measureText(op[0]).width;
    var textX = this.w*0.8 / 2 - textWidth / 2;
    var textY = this.h/2  + 8;
    capa.fillText(op[0], X+textX,Y+textY);
    let fase = op.slice(1);
    //Caso de la compuerta P 
    capa.font = "bold 9px Arial";
    if(fase){
      capa.fillText(fase, X+5,Y+this.h-5);
    }
  }
  clickEnDiagrama(x,y){
    let click = this.traductorXY(x,y);  
    this.matriz.setEstado(this.esatadoActual);  
    if(click==null){      
      return;
    }   
    if(this.estado==null){
      if(this.matriz.estado.matriz[click.Y][click.X]=='-'){
        return; 
      }
      this.popUpp(x,y,click.Y,click.X);
    }else if(this.estado==1){
      console.log(this.operador,click.Y,click.X)
      this.colocarCompuerta(this.operador,click.Y,click.X);
    }else if(this.estado==2){
      console.log(this.operador,click.Y,click.X)
      this.conectarA(click.Y,click.X)
    }else if(this.estado==3){
      console.log(this.operdor,click.Y,click.X)
      this.conectarB(click.Y,click.X)
    }    
    this.actualizarDiagrama();
    this.esatadoActual=this.matriz.getEstado()
  }
  popUpp(x,y,elementoY,elementoX){
    if(this.div != null){
      this.div.remove();
      this.div = null;
    }    
    const buttonBorrar = document.createElement('button');  
    buttonBorrar.className = "square-btn"
    buttonBorrar.innerHTML ='    <svg style="fill:#69a8e7" width="10px" heigth="10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'; 
    buttonBorrar.addEventListener('click', () => {
      this.matriz.borrarElemento(elementoY,elementoX);
      this.esatadoActual=this.matriz.getEstado();
      this.actualizarDiagrama();
      this.div.remove();
      this.div = null;
    });

    const PButton =  document.createElement('button');     
    PButton.className = "square-btn"
    PButton.innerHTML ="<span style='color:#69a8e7;'>P</span>"; 

    const Pin =  document.createElement('input');
    Pin.style.width = "50px"
    Pin.type = "number" 
    Pin.value = 180;
    Pin.style.border="none"
    Pin.style.textAlign="center"
    PButton.addEventListener('click', () => {
      let phase =Pin.value/1;
      if(phase==NaN){
        phase=0;
      }
      phase=phase%360
      this.matriz.estado.matriz[elementoY][elementoX]=('P'+phase)
      this.esatadoActual=this.matriz.getEstado();
      this.actualizarDiagrama();
      this.div.remove();
      this.div = null;
    });
    
    
    
    
    this.div = document.createElement('div');
    this.div.style.position = 'absolute'; 
    this.div.style.backgroundColor="white"
    //this.div.style.borderColor ="black"
    //this.div.style.borderWidth ="2px"
    this.div.appendChild(buttonBorrar);
    if(this.matriz.estado.matriz[elementoY][elementoX][0]=="P"){
      this.div.appendChild(PButton);
      this.div.appendChild(Pin);
    }
    
      
    
    this.div.style.top = `${this.Y+(elementoY)*(this.w+this.espacio)-35}px`;
    this.div.style.left = `${this.w*elementoX+this.X+this.w*0.1}px`;
    this.contenedor.appendChild(this.div);
    
    
    
  }
  actualizarDiagrama(){    
    console.log("Estado de la matriz:",this.matriz.estado);
    let X = this.X
    let Y = this.Y
    let w = this.w;
    let wc = this.w*0.75;
    let cw = (w-wc)/2
    let h = this.h;
    let espacio = this.espacio;
    ////////////////////////REDIMENSION
    let realW = X + (this.matriz.estado.final+1)*w;
    let realH = Y + (this.matriz.estado.qubits)*(h+espacio);
    if(realW>this.Wcanvas){
      this.canvas.width = realW+X;
      this.capa.width = realW+X;      
    }else{
      this.canvas.width = this.WcanvasMin;
      this.capa.width = this.WcanvasMin;
    }
    if(realH>this.Hcanvas){
      this.canvas.height = realH+Y;      
      this.capa.height = realH+Y; 
    }else{
      this.canvas.height = this.HcanvasMin;
      this.capa.height = this.HcanvasMin;
    }
    /////////////////////////DIBUJO
    this.ctx.clearRect(0,0,this.Wcanvas,this.Hcanvas)
    for (let i = 0; i < this.matriz.estado.matriz.length; i++) {  
      this.ctx.fillStyle = "#66869a"; 
      this.ctx.font = "bold 15px Arial";
      this.ctx.fillText('Q'+i,X-30,Y+i*(h+espacio)+h/2+5)
      this.ctx.fillRect(X,Y+i*(h+espacio)+h/2,w*this.matriz.estado.matriz[i].length,5);
      for (let j = 0; j < this.matriz.estado.matriz[i].length; j++) { 
        if(this.matriz.estado.matriz[i][j]!='-'){
          if(this.matriz.estado.matriz[i][j][0]=='C'){
            //Representacion de las conecciones:
            let objetivo = this.matriz.estado.matriz[i][j].slice(1)/1;
            let yObjetivo = Y+objetivo*(h+espacio)+h
            this.ctx.beginPath();
            this.ctx.arc(X+j*w+w/2,Y+i*(h+espacio)+h/2+1, 10, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.fillRect(X+j*w+w/2-2.5,Y+i*(h+espacio)+h/2,5,yObjetivo-(Y+i*(h+espacio)+h/2));
          }else{
            //Representacion de las compuertas:
            this.dibujarCompuerta(this.ctx,this.matriz.estado.matriz[i][j],X+j*w+cw,Y+i*(h+espacio))
            //this.ctx.fillStyle = "red";   
            //this.ctx.fillRect(X+j*w+cw,Y+i*(h+espacio),wc,h);
            //this.ctx.fillStyle = "black"; 
            //this.ctx.strokeRect(X+j*w+cw,Y+i*(h+espacio),wc,h);
            //this.ctx.fillText(this.matriz.estado.matriz[i][j][0], X+j*w+cw+wc/2-3,Y+i*(h+espacio)+h/1.75);
            //let fase = this.matriz.estado.matriz[i][j].slice(1);
            //Caso de la compuerta P 
            //if(fase){
              //this.ctx.fillText(fase, X+j*w+cw+1,Y+i*(h+espacio)+h-1);
            //}
          }          
        }     
      }
    }
  }
  diagramaCodigo(){
    this.log("Codigo generado automaticamente")
    this.matriz.setEstado(this.esatadoActual)
    this.codigo.value= this.matriz.generarCodigo()
  }
  codigoDiagrama(){
    console.log(this.codigo.value)
    this.matriz.generar(this.codigo.value);
    this.esatadoActual = this.matriz.getEstado();
    console.log(this.matriz.estado)
    this.actualizarDiagrama()
    this.log("Diagrama generado automaticamente")
  }
  /////
  colocarCompuerta(compuerta,qubit,lugar){
    this.matriz.operador(compuerta,qubit,lugar);
  }
  conectarA(qubit,lugar){
    this.seleccionadoParaConectar=qubit
    this.matriz.hacerAptaParaConectar(qubit,lugar)   
    this.cambiarEstado(3,null); 
  }
  conectarB(qubit,lugar){
    this.matriz.conector(qubit,lugar,this.seleccionadoParaConectar);
    this.cambiarEstado(null,null); 
  }
}
///////////////////////////////INICIO/////////////////////////////
let contenedor = document.getElementById("contenedor");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let capa = document.getElementById("capa");
let ctxCapa = capa.getContext("2d");

let diagramaCodigo = document.getElementById("digramaCodigo");
let codigoDiagrama = document.getElementById("codigoDiagrama");
let codigo = document.getElementById("codigo");

let bX = document.getElementById("X");
let bY = document.getElementById("Y");
let bZ = document.getElementById("Z");
let bH = document.getElementById("H");
let bM = document.getElementById("M");

let bP = document.getElementById("P");
let iP = document.getElementById("iP");

let bC = document.getElementById("C");

let bMas = document.getElementById("+");
let bMenos = document.getElementById("-");

let consola = document.getElementById("consola")
let inputs = document.getElementById("inputs")
let ejecutar = document.getElementById("ejecutar")
let generarTabla = document.getElementById("generarTabla")
let archivo = document.getElementById("archivo")
let generarResultados = document.getElementById("generarResultados")


//let circuto = new Circuito()
let inter = new interfaz(
  contenedor  
  ,canvas, ctx,capa, ctxCapa 
  ,diagramaCodigo,codigoDiagrama,codigo 
  ,bX,bY,bZ,bH, bM ,bP,iP,bC,bMas,bMenos
  ,consola ,inputs, ejecutar 
  , generarTabla , archivo , generarResultados ,
  null
  ,updateLineNumbers);