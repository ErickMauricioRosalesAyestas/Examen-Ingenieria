// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNECB94FSNcnZb9z1aeJEj4sWXshGYZ2E",
    authDomain: "formulario-ingenieria.firebaseapp.com",
    databaseURL: "https://formulario-ingenieria-default-rtdb.firebaseio.com",
    projectId: "formulario-ingenieria",
    storageBucket: "formulario-ingenieria.appspot.com",
    messagingSenderId: "362347491490",
    appId: "1:362347491490:web:a29de1ee33fd5e9f5b67fb"
  };

firebase.initializeApp(firebaseConfig);

 var txtNombre = document.getElementById("nombre");
 var txtApellido = document.getElementById("apellido");
 var txtIdentidad = document.getElementById("identidad");
 var txtFecha = document.getElementById("fecha");
 var txtCorreo = document.getElementById("correo");
 var txtFoto = document.getElementById("foto");
 var btnBoton = document.getElementById("boton");
 var tabla = document.getElementById("tabla-contenido");

 function validar(){
    let texto = "";
    var nombre = txtNombre.value;
    var apellido = txtApellido.value;
    var identidad = txtIdentidad.value;
    var fecha = txtFecha.value;
    var correo = txtCorreo.value;
    var foto = txtFoto.value;

    expresion = /\w+@\w+\.+[a-z]/;
    
    if(nombre === "" || apellido === "" || correo==="" || identidad === "" || fecha === "" || foto === ""){
        texto = "Todos los campos son necesarios";
        window.alert(texto);
        return false;
    }
    else if(nombre.length>20){
        texto = "El nombre es muy largo";
        window.alert(texto);
        return false;
    }
    else if(apellido.length>30){
        texto = "El apellido es muy largo";
        window.alert(texto);
        return false;
    }else if(correo.length>40){
        texto = "El email es muy largo";
        window.alert(texto);
        return false;
    }else if(identidad.length!=13){
        texto = "El identidad no cuenta con 13 digitos";
        window.alert(texto);
        return false;
    }
    else if(!expresion.test(correo)){
        texto = "El email no es válido";
        window.alert(texto);
        return false;
    }else{
        return true
    }
 }

 btnBoton.addEventListener('click', function(){
    var nombre = txtNombre.value;
    var correo = txtCorreo.value;

    if(validar() == true){
        firebase.auth().createUserWithEmailAndPassword(correo, nombre)
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        })
        .then(function () {
            verificar();
        });
    }
});

function verificar() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        firebase.database().ref('formulario').push({
            nombre: txtNombre.value,
            apellido: txtApellido.value,
            identidad: txtIdentidad.value,
            fecha: txtFecha.value,
            correo: txtCorreo.value,
            foto: txtFoto.value
        });
        txtNombre.value = ''; 
        txtApellido.value = '';
        txtIdentidad.value = '';
        txtFecha.value = '';
        txtCorreo.value = '';
        txtFoto.value = '';
    }).catch(function (error) {
        // An error happened.
    });
}

function cerrar() {
    firebase.auth().signOut()
    .then(function () {
        console.log('Salir');
    })
    .catch(function (error) {
        console.log(error);
    })
}

firebase.database().ref('formulario')
.on('value', function(snapshot){
   var html = '';
   snapshot.forEach(function (e) {
       var element = e.val();
       var nombre = element.nombre;
       var apellido = element.apellido;
       var identidad = element.identidad;
       var fecha = element.fecha;
       var correo = element.correo;
       var foto = element.foto;
       html += 
       `<tr>
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${identidad}</td>
        <td>${fecha}</td>
        <td>${correo}</td>
        <td><img id="imagen" src="${foto}" alt=""></td>
        </tr>`;
   });
   tabla.innerHTML = html;
}); 