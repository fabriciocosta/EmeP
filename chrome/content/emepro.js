function buildValue(sValue) {  
    if (/^\s*$/.test(sValue)) { return(null); }  
    if (/^(true|false)$/i.test(sValue)) { return(sValue.toLowerCase() === "true"); }  
    if (isFinite(sValue)) { return(parseFloat(sValue)); }  
    if (isFinite(Date.parse(sValue))) { return(new Date(sValue)); }  
    return(sValue);  
}  

var _templates = new Array();

var _tipo_campos = new Array();

_tipo_campos['texto'] = 'ok';
_tipo_campos['parrafo'] = 'ok';
_tipo_campos['fecha'] = 'no';
_tipo_campos['selection'] = 'no';

_templates['texto']= '<html:div class="campo">';
_templates['texto']+=  '	<html:div class="titulo">';
_templates['texto']+=  '		<html:label class="titulocampo" title="{AYUDARAPIDA}"><html:span>{NOMBRECAMPO}</html:span></html:label>';
_templates['texto']+=  '		<html:div class="marker">';
_templates['texto']+=  '			<html:div class="markers">';
_templates['texto']+=  '				<html:div class="marker-verde marker-selected"></html:div>';
_templates['texto']+=  '				<html:div class="marker_options" id="marcar_{IDCAMPO}_options">';
_templates['texto']+=  '					<html:div value="verde" class="marker-verde marker-option"></html:div>';
_templates['texto']+=  '					<html:div value="amarillo" class="marker-amarillo marker-option"></html:div>';
_templates['texto']+=  '					<html:div value="rojo" class="marker-rojo marker-option"></html:div>';
_templates['texto']+=  '				</html:div>';
_templates['texto']+=  '				<html:div class="marker_button" id="marcar_{IDCAMPO}_"></html:div>';
_templates['texto']+=  '			</html:div>';
_templates['texto']+=  '			<html:div class="ayuda" id="ayuda_{IDCAMPO}_"></html:div>';
_templates['texto']+=  '		</html:div>';
_templates['texto']+=  '		<html:div class="texto-ayuda" id="ayuda_{IDCAMPO}_cuerpo"><html:img border="0" class="tri" src="img/tri_amarillo.png"/>';
_templates['texto']+=  '			<html:span>{AYUDA}</html:span>';
_templates['texto']+=  '		</html:div>';	
_templates['texto']+=  '	</html:div>';
_templates['texto']+=  '	<html:div class="entrada">';
_templates['texto']+=  '		<html:input type="text" value="ingresa tu texto"/>';
_templates['texto']+=  '	</html:div>';
_templates['texto']+= '</html:div>';
/*COMUN A TODOS*/


_templates['parrafo'] = '<html:div class="campo">';
_templates['parrafo']+= '	<html:div class="titulo">';
_templates['parrafo']+= '		<html:label class="titulocampo" title="{AYUDARAPIDA}"><html:span>{NOMBRECAMPO}</html:span></html:label>';
_templates['parrafo']+= '		<html:div class="marker">';
_templates['parrafo']+= '			<html:div class="markers">';
_templates['parrafo']+= '				<html:div class="marker-rojo marker-selected"></html:div>';
_templates['parrafo']+= '				<html:div class="marker_options" id="marcar_{IDCAMPO}_options">';
_templates['parrafo']+= '					<html:div value="verde" class="marker-verde marker-option"></html:div>';
_templates['parrafo']+= '					<html:div value="amarillo" class="marker-amarillo marker-option"></html:div>';
_templates['parrafo']+= '					<html:div value="rojo" class="marker-rojo marker-option"></html:div>';
_templates['parrafo']+= '				</html:div>';
_templates['parrafo']+= '				<html:div class="marker_button" id="marcar_{IDCAMPO}_"></html:div>';
_templates['parrafo']+= '			</html:div>';
_templates['parrafo']+= '			<html:div class="ayuda" id="ayuda_{IDCAMPO}_"></html:div>';
_templates['parrafo']+= '		</html:div>';
_templates['parrafo']+= '		<html:div class="texto-ayuda" id="ayuda_{IDCAMPO}_cuerpo"><html:img border="0" class="tri" src="img/tri_amarillo.png"/>';
_templates['parrafo']+= '			<html:span>{AYUDA}</html:span>';
_templates['parrafo']+= '		</html:div>';
_templates['parrafo']+= '	</html:div>';
_templates['parrafo']+= '	<html:div class="entrada">';
_templates['parrafo']+= '		<html:textarea class="parrafo" id="parrafo_{IDCAMPO}_" style="display: block;" rows="7">Esto es un texto de prueba</html:textarea>';
_templates['parrafo']+= '	</html:div>';
_templates['parrafo']+= '</html:div>';



_templates['fecha'] = _templates['texto'];
_templates['seleccion'] = _templates['texto'];
_templates['multiple'] = _templates['texto'];
_templates['rango_a'] = _templates['texto'];
_templates['rango_de'] = _templates['texto'];

// ------------------------------------------------------------------
// use helper functions to hook up the emepro object so "this"
// works in the explorer object
// ------------------------------------------------------------------

function emepro_startup() {
  emepro.startup();
}

function emepro_shutdown() {
  emepro.shutdown();
}


// ------------------------------------------------------------------
// attach to window events so emepro object can startup / shutdown
// ------------------------------------------------------------------

window.addEventListener("load", emepro_startup, false);
window.addEventListener("unload", emepro_shutdown, false);


// ------------------------------------------------------------------
// emepro object
// ------------------------------------------------------------------

var emepro = {
  initialized : false,

  
  _handleWindowClose : function(event) {
    // handler for clicking on the 'x' to close the window
    return this.shutdownQuery();
  },


  _initSidebar : function(sidebarID) {
    if (sidebarID) {
      var sidebar = document.getElementById(sidebarID);
      var sidebarDeck = document.getElementById("sidebar_deck");
      sidebarDeck.selectedPanel = sidebar;
      var sidebarTitle = document.getElementById("sidebar_title");
      sidebarTitle.value = sidebar.getAttribute("label");
    }
  },

  toggleSidebar : function(sidebarID, forceOpen) {
    var sidebarBox = document.getElementById("sidebar_box");
    var sidebarSplitter = document.getElementById("sidebar_split");
    if (forceOpen || sidebarBox.hidden) {
      sidebarBox.hidden = false;
      sidebarSplitter.hidden = false;

      this._initSidebar(sidebarID);      
    }
    else {
      sidebarBox.hidden = true;
      sidebarSplitter.hidden = true;
    }
  },


  startup : function() {
    if (this.initialized)
      return;
    this.initialized = true;

    var self = this;

    window.addEventListener("close", function(event) { self._handleWindowClose(event); }, false);


    // initialize the sidebar
	/*
    document.getElementById("sidebar_close").addEventListener("command", function(event) { self.toggleSidebar(null, null); }, false);
    this._initSidebar("sidebar_page1");
*/

    FileController.init(this);
    window.controllers.appendController(FileController);


    ToolsController.init(this);
    window.controllers.appendController(ToolsController);


    HelpController.init(this);
    window.controllers.appendController(HelpController);

    


  },

  shutdownQuery : function() {
    // do any shutdown checks
    // return false to stop the shutdown
    return true;
  },
    
  shutdown : function() {

  }
  
  
};


 function openFile() {
	
	//alert('opening')
	
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Abrir un proyecto EME Pro", nsIFilePicker.modeOpen);
	
	fp.appendFilters( nsIFilePicker.filterText | nsIFilePicker.filterAll );
	fp.appendFilter("Archivos EME Pro ","*.eml; *.xml");
	
	var res = fp.show();
	
	if (res == nsIFilePicker.returnOK){
	  var thefile = fp.file;
	  // --- do something with the file here ---
	  /*alert( "Abriendo: " + thefile.path);*/
	  loadDB( thefile );
	  
	}
	
  }
  
  
  
/*var dbfile = "D:\\_data\\proyectos\\SINESTESIA\\MOLDEO\\Servicios\\Moldeo Interactive\\Trabajo\\eme project\\pruebas xul\\test.xml";*/
var data = "";
var xmlfile = "D:\\_data\\proyectos\\SINESTESIA\\MOLDEO\\Servicios\\Moldeo Interactive\\Trabajo\\eme project\\pruebas xul\\test.xml";
var _dbtree;
var _dbfile;
var _dbstring;
var _htmltree;

var _dbsecciones;
/*
class EMEDB {

	var dbtree;
	
	function EMEDB() {
		alert("objeto creado");
	}

};

var _EMEDB;

_EMEDB = new EMEDB();
*/

function trim(str) {

	str = jQuery.trim(str);
	return str;
}

function loadTree() {

	var doc = _dbtree.documentElement;
	var htmlTree = document.getElementById("dbtree");
	
	//alert("doc:"+doc);    
	//alert("htmltree:"+htmlTree);
	
	//a//lert( "nodes:"+doc.childNodes );
	//alert( "nodes l:"+doc.childNodes.length );
	
	/*crea el string completo*/
	var ncats = 0;
	var idcampo = 0;

	_htmltree = new Array();
	_dbsecciones = new Array();
	_dbstring = '<html:ul class="categoria item-0 level-0">';
	var _dbstring_2 = '';
	for( var i=0; i<doc.childNodes.length; i++) {
		//alert(i);
		var categoria = doc.childNodes[i];
		
		/*categorias*/
		if ( categoria.nodeName == "categoria" ) {
			//var nombre = categoria.getElementsByTagName("label")[0].nodeValue;
			var labels = categoria.getElementsByTagName("label");
			//alert( labels.length );
			nombre = labels[0].childNodes[0].nodeValue;
			_htmltree[ncats] = new Array();
			
			//alert("categoria:"+nombre);
			_dbstring+=  '<html:li  id ="cat'+ncats+'_padre" class="categoria item-0 first padre categoria-collapsed">'
							+ '	<html:a id="cat'+ncats+'" class="categoria" title="">'
							+ nombre
							+ '	</html:a>'
							+'	</html:li>';
			
							
			/*...*/
			/*RECORREMOS LAS SECCIONES*/
			var secciones = categoria.childNodes;
			//alert(secciones.length);
			_dbstring+= '<html:ul id ="cat'+ncats+'_cuerpo" class="secciones  deep-0" style="display: none;">';
			var nseccion = 0;
			for( var s =0 ;s < secciones.length ; s++ ) {
				var seccion = secciones[s];
				if (seccion.nodeName=="seccion") {
				
					_htmltree[ncats][nseccion] = new Array();
				
					var nombre = trim(seccion.childNodes[0].nodeValue);
					var nombre_s = nombre;

					var link_loader_campos_s = ' href="javascript:loadFields(\''+nombre_s+'\');" ';
					var hay_campos_s = false;					
					var coma_s = "";
					
					_dbsecciones[nombre_s] = new Array( "campos","subsecciones" );
					_dbsecciones[nombre_s]["campos"] = "";
					_dbsecciones[nombre_s]["idcampos"] = "";
					_dbsecciones[nombre_s]["tipocampos"] = "";
					_dbsecciones[nombre_s]["subsecciones"] = new Array();
					
					//alert(nombre);
					_dbstring+= '<html:li id ="secin'+ncats+'_'+nseccion+'_padre" class="seccion padre-collapsed">'
							+ '	<html:a id ="secin'+ncats+'_'+nseccion+'" '+link_loader_campos_s+'>'
							+ nombre
							+ '	</html:a>';						
							
					/*SUBSECCIONES*/
					var subsecciones = seccion.childNodes;
					
					if (subsecciones.length>0) {
						
						_dbstring+= '<html:ul id ="secin'+ncats+'_'+nseccion+'_cuerpo" class="secciones deep-1"  style="display: none;">';
						var nsubseccion = 0;
						
						for( var sub =0 ; sub < subsecciones.length ; sub++ ) {
						
							var subseccion = subsecciones[sub];
							
							/*ATTRIBUTES*/
							var tipo_campo = "";
							
							var keyAttributes = {};
							if (subseccion.hasAttributes()) {  
								var iAttrib; 
								var nAttrLen = 0;								
								for (nAttrLen=0; nAttrLen < subseccion.attributes.length; nAttrLen++) {  
									iAttrib = subseccion.attributes.item(nAttrLen);  
									keyAttributes[iAttrib.nodeName.toLowerCase()] = buildValue(iAttrib.nodeValue); 
									if (iAttrib.nodeName.toLowerCase()=="tipo") {
										tipo_campo = keyAttributes[iAttrib.nodeName.toLowerCase()];										
									}
								}  
							}							
							
							if (subseccion.nodeName=="seccion") {
								_htmltree[ncats][nseccion][nsubseccion] = new Array();
								
								nombre = trim(subseccion.childNodes[0].nodeValue);
								var nombre_s_s = trim(nombre);
								var link_loader_campos_s_s = ' href="javascript:loadFields(\''+nombre_s_s+'\');" ';
								var hay_campos_s_s = false;
								var coma_s_s = "";
								_dbsecciones[nombre_s_s] = new Array( "campos","subsecciones" );
								_dbsecciones[nombre_s_s]["campos"] = "";
								_dbsecciones[nombre_s_s]["idcampos"] = "";								
								_dbsecciones[nombre_s_s]["tipocampos"] = "";
								_dbsecciones[nombre_s_s]["subsecciones"] = new Array();								
								
								_dbstring+= '<html:li id ="secinin'+ncats+'_'+nseccion+'_'+nsubseccion+'_padre" class="seccion padre-collapsed">'
								+ '	<html:a id ="secinin'+ncats+'_'+nseccion+'_'+nsubseccion+'" '+link_loader_campos_s_s+'>'
								+ nombre_s_s
								+ '	</html:a>';										
								
								
								/* PROCESAR SUB SUBSECCIONES O CAMPOS.... */
								var subsubsecciones = subseccion.childNodes;								
								
								for( var subsub =0 ; subsub < subsubsecciones.length ; subsub++ ) {
								
									var subsubseccion = subsubsecciones[subsub];
									
									/*ATTRIBUTES*/
									var sub_tipo_campo = "";
									var sub_keyAttributes = {};
									if (subsubseccion.hasAttributes()) {  
										var sub_iAttrib; 
										var sub_nAttrLen = 0;								
										for (sub_nAttrLen=0; sub_nAttrLen < subsubseccion.attributes.length; sub_nAttrLen++) {  
											sub_iAttrib = subsubseccion.attributes.item(sub_nAttrLen);  
											sub_keyAttributes[sub_iAttrib.nodeName.toLowerCase()] = buildValue(sub_iAttrib.nodeValue); 
											if (sub_iAttrib.nodeName.toLowerCase()=="tipo") {
												sub_tipo_campo = sub_keyAttributes[sub_iAttrib.nodeName.toLowerCase()];										
											}
										}  
									}
									
									/*CAMPO*/
							
									if (subsubseccion.nodeName=="campo") {
									
										idcampo = idcampo + 1;
										var nombre_campo = trim(subsubseccion.childNodes[0].nodeValue);
									
										if (sub_tipo_campo!="" && sub_tipo_campo!="undefined"  && _templates[sub_tipo_campo]!="" && _templates[sub_tipo_campo]!=undefined) {
										
											//alert("sub_tipo_campo:"+sub_tipo_campo);
										
											var template_campo = _templates[sub_tipo_campo];
											hay_campos_s_s =true;
											
											template_campo = template_campo.replace( "{NOMBRECAMPO}", trim(nombre_campo) );
											template_campo = template_campo.replace( /{IDCAMPO}/gi, idcampo );
											template_campo = template_campo.replace( "{AYUDARAPIDA}", "La ayuda rápida" );
											template_campo = template_campo.replace( "{AYUDA}", "La ayuda completa" );
											
											_dbsecciones[nombre_s_s]["campos"]+= template_campo;
											_dbsecciones[nombre_s_s]["idcampos"]+= coma_s_s+idcampo;
											_dbsecciones[nombre_s_s]["tipocampos"]+= coma_s_s+sub_tipo_campo;
											
											coma_s_s = "|";
											
											//alert("["+nombre_s+"]");
										} else {
											alert("tipo no definido:"+sub_tipo_campo);
										}
									}									
								
								}
								
								if (!hay_campos_s_s) link_loader_campos_s_s = "";	

								/*sumar arbol interno*/								
								
								nsubseccion++;
								_dbstring+= '	</html:li>';
							}
							
							/*CAMPO*/
							
							if (subseccion.nodeName=="campo") {

								idcampo = idcampo + 1;
						
								nombre = trim(subseccion.childNodes[0].nodeValue);
							
								if (tipo_campo!="" && tipo_campo!="undefined" && _templates[tipo_campo]!="" && _templates[tipo_campo]!=undefined) {
								
									var template_campo = _templates[tipo_campo];
									hay_campos_s =true;
									
									template_campo = template_campo.replace( "{NOMBRECAMPO}", trim(nombre) );
									template_campo = template_campo.replace( /{IDCAMPO}/gi, idcampo );
									template_campo = template_campo.replace( "{AYUDARAPIDA}", "La ayuda rápida" );
									template_campo = template_campo.replace( "{AYUDA}", "La ayuda completa" );
									
									_dbsecciones[nombre_s]["campos"]+= template_campo;
									_dbsecciones[nombre_s]["idcampos"]+= coma_s + idcampo;
									_dbsecciones[nombre_s]["tipocampos"]+= coma_s + tipo_campo;
									
									coma_s = "|";
									//alert("["+nombre_s+"]");
								} else {
									alert("tipo no definido:"+tipo_campo);
								}
							}
							
						}
						
						if (!hay_campos_s) link_loader_campos_s = "";		
						
						/*sumar arbol interno*/
						
						_dbstring+= '</html:ul>';
					}
					
					nseccion++;
					_dbstring+= '	</html:li>';

				}
			}
			/*...*/
			_dbstring+= '</html:ul>';
			ncats++;
		}
	}
	
	_dbstring+= "</html:ul>";
	
	htmlTree.innerHTML = _dbstring;


	/* JQUERY    */
	
	var nc = 0;
	var ns = 0;
	var nsub = 0;
	alert(_htmltree);
	for( nc=0; nc<_htmltree.length; nc++ ) {
		var CA = $('#cat'+nc);
		 $('#cat'+nc).attr( "nc", nc );
		 //alert( CS.n );		 
		 CA.click(
			function() {
				  
				  //alert( $(this).attr('n') );
				  
				 var cuerpo = $('#cat'+$(this).attr('nc')+'_cuerpo');
				 var seccion = document.getElementById('cat'+$(this).attr('nc')+'_padre');
			
				 if (cuerpo.is( ':visible' )) {
					cuerpo.hide();
					seccion.className = 'categoria padre categoria-collapsed';
				 } else {
					seccion.className = 'categoria padre categoria-expanded';
					cuerpo.slideDown('slow');
				}
		});
		
		for( ns=0; ns<_htmltree[nc].length; ns++ ) {
			var CS = $('#secin'+nc+'_'+ns);
			$('#secin'+nc+'_'+ns).attr( "ns", ns );
			$('#secin'+nc+'_'+ns).attr( "nc", nc );
			
			CS.click(
				function() {
					var cuerpo = $('#secin'+$(this).attr('nc')+'_'+$(this).attr('ns')+'_cuerpo');
					var seccion = document.getElementById('secin'+$(this).attr('nc')+'_'+$(this).attr('ns')+'_padre');
			
					if (cuerpo.is( ':visible' )) {
						cuerpo.hide();
						seccion.className = 'seccion padre-collapsed';
					} else {
						seccion.className = 'seccion padre-expanded';
						cuerpo.slideDown('slow');
					}
					
					
				}
			); 
			
			/*SUBSECCIONES*/
			for( nsub=0; nsub<_htmltree[nc][ns].length; nsub++ ) {
				var CSUB = $('#secin'+nc+'_'+ns+'_'+nsub);
				$('#secinin'+nc+'_'+ns+'_'+nsub).attr( "nsub", nsub );
				$('#secinin'+nc+'_'+ns+'_'+nsub).attr( "ns", ns );
				$('#secinin'+nc+'_'+ns+'_'+nsub).attr( "nc", nc );
				
				$('#secinin'+nc+'_'+ns+'_'+nsub).click(
					function() {
							 var cuerpo = $('secinin'+$(this).attr('nc')+'_'+$(this).attr('ns')+'_'+$(this).attr('nsub')+'_cuerpo');
							 var seccion = document.getElementById('secinin'+$(this).attr('nc')+'_'+$(this).attr('ns')+'_'+$(this).attr('nsub')+'_padre');
						
							 if (cuerpo.is( ':visible' )) {
								cuerpo.hide();
								seccion.className = 'seccion padre-collapsed';
							 } else {
								seccion.className = 'seccion padre-expanded';
								cuerpo.slideDown('slow');
							}
					}
				); 
				
			}
			
		}
		
	}
		
	
}

function loadFields(nombreseccion) {

	var htmlFormulario = document.getElementById("dbformulario");
	var dbseccion = _dbsecciones[nombreseccion];
	
	if (dbseccion!="" && dbseccion!=undefined) {
		if (dbseccion["campos"]!="" && dbseccion["campos"]!=undefined) {
			
			//alert(dbseccion["campos"]);
			
			htmlFormulario.innerHTML = dbseccion["campos"];
			
			
			/*acá se ejecuta el script par activar las ayudas rapidas*/
			var idCampos = dbseccion["idcampos"];
			var tipoCampos = dbseccion["tipocampos"];
		
			var idCampos_x = idCampos.split("|");
			var tipoCampos_x = tipoCampos.split("|");
			
			for(var i=0; i<idCampos_x.length; i++) {
				var idCampo = idCampos_x[i];
				
				var AYUDA = $('#ayuda_'+idCampo+'_');
				AYUDA.attr( "idcampo", idCampo );
				
				AYUDA.click(
					function() {
						var cuerpo = $( "#ayuda_" + $(this).attr('idcampo') + "_cuerpo" );
						if (cuerpo.is( ":visible" )) {
							cuerpo.hide();
						} else {
							cuerpo.slideDown("slow");
						}
					}
					
				);

				var MARCAR = $('#marcar_'+idCampo+'_');
				MARCAR.attr( "idcampo", idCampo );
				
				MARCAR.click(function() {
					var cuerpo = $("#marcar_"+$(this).attr('idcampo')+"_options");
					if (cuerpo.is( ":visible" )) {
						cuerpo.hide();
					} else {
						cuerpo.show();
					}
				});
				
				var MARCAR_OPTIONS = $('#marcar_'+idCampo+'_options');
				MARCAR_OPTIONS.attr( "idcampo", idCampo );
				
				MARCAR_OPTIONS.click(function() {
					var cuerpo = $(this);
					if (cuerpo.is( ":visible" )) {
						cuerpo.hide();
					}
				});		


				/*PARRAFOS*/
				var tipo = tipoCampos_x[i];
				/*alert(tipo);*/
				if (tipo=='parrafo') {		
										
					if ( CKEDITOR!=undefined ) {					
					
						var obj = document.getElementById( 'parrafo_' + idCampo + '_' );											
						
						if (obj) CKEDITOR.replace( obj );												
						else alert("Objeto no encontrado");
						
					} else {
						alert(CKEDITOR);
					}
				}
				
				
			}
			
	
		} else {
			alert("sin campos:"+nombreseccion);
		}
	} else {
		alert("sin seccion/campos:"+nombreseccion);
	}

}


function loadxml() {

    //var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"].createInstance(Components.interfaces.nsIDOMParser);
    //var c = domParser.parseFromString( content, "text/xml" );
    var parser = new DOMParser();
    
	_dbtree = parser.parseFromString( data, "text/xml");
    
	//alert(_dbtree );
	
	loadTree();
}

function load( file ) {

    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    //file.initWithPath("C:\\Windows");
    file.initWithPath(dbfile);
   
    if ( file.exists() == false ) {
        alert("File does not exist : " + file.path);
        return false;
    }

    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
    var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);

    fstream.init(file, 0x01, 00004, null);
    sstream.init(fstream);

    var output = sstream.read(sstream.available());
    data = output;
    sstream.close();
    fstream.close();   
}


function loadDB( file ) {

	if ( file.exists() == false ) {
        alert("File does not exist : " + file.path);
        return false;
    }

	_dbfile= file;
		
    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
    var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);

    fstream.init( _dbfile, 0x01, 00004, null);
    sstream.init(fstream);

    var output = sstream.read(sstream.available());
    data = output;
	loadxml();	
    /*alert( data );*/
    sstream.close();
    fstream.close();	

}


function saveDB( dbfile ) {

	var serializer = new XMLSerializer();
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				   .createInstance(Components.interfaces.nsIFileOutputStream);
				   
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
			   .getService(Components.interfaces.nsIProperties)
			   .get("ProfD", Components.interfaces.nsILocalFile); // get profile folder
			   
	file.append("extensions");   // extensions sub-directory
	file.append("{5872365E-67D1-4AFD-9480-FD293BEBD20D}");   // GUID of your extension
	file.append("myXMLFile.xml");   // filename
	foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);   // write, create, truncate
	serializer.serializeToStream( dbtree, foStream, "");   // rememeber, doc is the DOM tree
	foStream.close();

}

function write()
{
    data = "\n"+"uh yeah, uh yeah";

    var file = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                             .createInstance(Components.interfaces.nsIFileOutputStream);
    file.initWithPath( dbfile );
    if ( file.exists() == false ) {
          alert("File does not exist");
    }

    foStream.init(file, 0x02 | 0x10, 00666, 0);
    foStream.write(data, data.length);
    foStream.close();

    load();
}

function StreamToFile(stream, file)
    {
        var output = Components.classes["@mozilla.org/network/file-output-stream;1"].
                     createInstance(Components.interfaces.nsIFileOutputStream);
        output.init(file, 0x02 | 0x08 | 0x20, 0664, output.DEFER_OPEN);
        Components.utils.import("resource://gre/modules/NetUtil.jsm");
        NetUtil.asyncCopy(stream, output);
    }  

	
function OpenWindow() {

window.open(
	  "chrome://emepro/content/newwindow.xul",
	  "main",
	  "chrome,centerscreen");
}
	
	
