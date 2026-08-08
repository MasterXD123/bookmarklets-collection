(function() {
    // Objeto o array para almacenar el historial de tu proceso
    window.ProcesoLog = [];

    // Devuelve la posición (1-based) del elemento entre sus hermanos del mismo tag
    function posicionEntreHermanos(elemento) {
        if (!elemento.parentElement) return 1;
        const hermanos = Array.from(elemento.parentElement.children).filter(
            el => el.tagName === elemento.tagName
        );
        return hermanos.indexOf(elemento) + 1;
    }

    // Sube por los padres construyendo una ruta de selectores hasta encontrar
    // un ancla estable (un ancestro con ID real) o llegar al <body>.
    // Devuelve algo como: "#chat-container > div:nth-of-type(2) > button:nth-of-type(1)"
    function generarSelectorUnico(elemento) {
        const partes = [];
        let actual = elemento;
        let profundidad = 0;
        const MAX_PROFUNDIDAD = 8; // evita rutas infinitas/eternas

        while (actual && actual.nodeType === 1 && profundidad < MAX_PROFUNDIDAD) {
            // Si encontramos un ancestro con ID real, lo usamos como ancla y paramos
            if (actual.id) {
                partes.unshift(`#${CSS.escape(actual.id)}`);
                return partes.join(' > ');
            }

            // Si llegamos al body sin encontrar ID, lo usamos como ancla raíz
            if (actual.tagName === 'BODY') {
                partes.unshift('body');
                return partes.join(' > ');
            }

            const tag = actual.tagName.toLowerCase();
            const posicion = posicionEntreHermanos(actual);
            partes.unshift(`${tag}:nth-of-type(${posicion})`);

            actual = actual.parentElement;
            profundidad++;
        }

        // Si se alcanzó el límite de profundidad sin ancla, devolvemos la ruta parcial igual
        return partes.length ? partes.join(' > ') : null;
    }

    // Función para registrar y mostrar en consola de forma estilizada
    function registrarEvento(tipo, elemento, detalles, resultado) {
        const timestamp = new Date().toLocaleTimeString();
        const evento = {
            timestamp: timestamp,
            tipo: tipo,
            etiqueta: elemento.tagName,
            id: elemento.id || 'Sin ID',
            clase: elemento.className || 'Sin Clase',
            texto: elemento.innerText ? elemento.innerText.trim().substring(0, 40) : '',
            selector_ruta: generarSelectorUnico(elemento),
            detalles_extras: detalles,
            url_actual: window.location.href
        };
        window.ProcesoLog.push(evento);

        // Estilo visual en la consola
        console.group(`%c[PASO ${window.ProcesoLog.length}] ${tipo} -> <${elemento.tagName}>`, 'color: #00bcd4; font-weight: bold;');
        console.log(`📍 Elemento / Texto:`, evento.texto);
        console.log(`🆔 ID / Clases:`, `ID: ${evento.id} | Clase: ${evento.clase}`);
        if (detalles) {
            console.log(`📋 Opciones / Opciones disponibles:`, detalles);
        }
        console.log(`🔗 URL:`, evento.url_actual);
        console.groupEnd();
    }

    // Bandera que controla si el listener está grabando o no
    window.capturaActiva = false;

    // Handler de clics (separado para poder añadir/quitar el listener limpiamente)
    function handlerClic(event) {
        if (!window.capturaActiva) return; // si la captura está detenida, ignoramos el evento

        const target = event.target;
        let detallesExtras = null;

        // Si el elemento es un selector <select>, capturamos todas sus opciones
        if (target.tagName === 'SELECT') {
            detallesExtras = Array.from(target.options).map(opt => ({
                valor: opt.value,
                texto: opt.text,
                seleccionado: opt.selected
            }));
        }
        // Si el elemento está dentro de un contenedor o tiene atributos especiales
        else {
            detallesExtras = {
                padre: target.parentElement ? target.parentElement.tagName : null,
                tipo_input: target.type || 'N/A'
            };
        }

        registrarEvento('CLIC', target, detallesExtras);
    }

    // El listener se registra siempre, pero solo actúa si capturaActiva === true
    document.addEventListener('click', handlerClic, true);

    // Función global para INICIAR la toma de datos
    window.iniciarCaptura = function(opciones = {}) {
        if (window.capturaActiva) {
            console.warn("⚠️ La captura ya estaba activa. No se reinició el log.");
            return;
        }

        // Por defecto, si no se indica lo contrario, reinicia el log al iniciar
        const limpiarLog = opciones.limpiarLog !== undefined ? opciones.limpiarLog : true;
        if (limpiarLog) {
            window.ProcesoLog = [];
        }

        window.capturaActiva = true;
        console.log("%c▶️ Captura de proceso INICIADA. Grabando clics...", "color: #4caf50; font-size: 14px; font-weight: bold;");
    };

    // Función global para DETENER la toma de datos
    window.detenerCaptura = function() {
        if (!window.capturaActiva) {
            console.warn("⚠️ La captura ya estaba detenida.");
            return;
        }

        window.capturaActiva = false;
        console.log(`%c⏹️ Captura de proceso DETENIDA. Se grabaron ${window.ProcesoLog.length} pasos.`, "color: #f44336; font-size: 14px; font-weight: bold;");
        console.log("%c💡 Usa exportarProceso() o copiarProceso() para guardar el resultado.", "color: #ff9800; font-size: 12px;");
    };

    console.log("%c✅ Scraper de procesos por consola cargado con éxito.", "color: #4caf50; font-size: 14px; font-weight: bold;");
    console.log("%c💡 Escribe 'iniciarCaptura()' para empezar a grabar, y 'detenerCaptura()' para parar.", "color: #2196f3; font-size: 12px; font-weight: bold;");
    console.log("%c💡 Cuando termines, usa 'exportarProceso()' para descargar el JSON, o 'copiarProceso()' para copiarlo al portapapeles.", "color: #ff9800; font-size: 12px;");

    // Función global para exportar los datos recopilados al finalizar (descarga archivo)
    window.exportarProceso = function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.ProcesoLog, null, 4));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "proceso_consola_log.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        console.log("📥 ¡Archivo 'proceso_consola_log.json' descargado con éxito!");
    };

    // Función global para copiar los datos recopilados al portapapeles
    window.copiarProceso = function() {
        const jsonStr = JSON.stringify(window.ProcesoLog, null, 4);

        // Método moderno: Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonStr).then(function() {
                console.log("%c📋 ¡Proceso copiado al portapapeles con éxito!", "color: #4caf50; font-size: 13px; font-weight: bold;");
            }).catch(function(err) {
                console.warn("⚠️ Clipboard API falló, usando método alternativo...", err);
                copiarFallback(jsonStr);
            });
        } else {
            // Fallback para navegadores/contextos que bloquean la Clipboard API
            copiarFallback(jsonStr);
        }
    };

    // ============================================================
    // EJECUTAR PROCESO: intenta reproducir una secuencia de eventos
    // ============================================================
    // Parámetro: array de eventos (mismo formato que ProcesoLog)
    // Uso: ejecutarProceso(window.ProcesoLog)  o  ejecutarProceso(JSON.parse(pegadoDesdeArchivo))
    window.ejecutarProcesoCancelado = false;

    window.ejecutarProceso = function(datos, opciones = {}) {
        const config = {
            respetarTiempos: opciones.respetarTiempos !== undefined ? opciones.respetarTiempos : true,
            velocidad: opciones.velocidad || 1, // 1 = tiempo real, 2 = doble de rápido, 0.5 = mitad
            delayMinimo: opciones.delayMinimo || 500, // ms mínimo entre pasos si no hay tiempos
            delayMaximo: opciones.delayMaximo || 5000, // tope máximo de espera entre pasos
            detenerSiFalla: opciones.detenerSiFalla || false
        };

        // Si nos pasaron un string (JSON sin parsear), lo intentamos parsear automáticamente
        if (typeof datos === 'string') {
            try {
                datos = JSON.parse(datos);
                console.log("%cℹ️ Se detectó un string y se parseó automáticamente a JSON.", "color: #2196f3;");
            } catch (err) {
                console.error("❌ ejecutarProceso: el string pasado no es un JSON válido.", err);
                return;
            }
        }

        if (!Array.isArray(datos) || datos.length === 0) {
            console.error("❌ ejecutarProceso: se esperaba un array de eventos no vacío. Recibido:", datos);
            return;
        }

        // Filtramos y normalizamos eventos: deben ser objetos con al menos 'etiqueta'
        const datosOriginales = datos.length;
        datos = datos.filter((evento, idx) => {
            if (!evento || typeof evento !== 'object' || Array.isArray(evento)) {
                console.warn(`⚠️ Paso ${idx + 1} ignorado: no es un objeto de evento válido.`, evento);
                return false;
            }
            if (!evento.etiqueta) {
                console.warn(`⚠️ Paso ${idx + 1} ignorado: falta el campo 'etiqueta'.`, evento);
                return false;
            }
            return true;
        });

        if (datos.length === 0) {
            console.error("❌ ejecutarProceso: ningún evento tenía el formato esperado (¿pasaste el array correcto?). Revisa que cada objeto tenga al menos: etiqueta, id, clase, texto.");
            return;
        }

        if (datos.length < datosOriginales) {
            console.warn(`⚠️ Se ignoraron ${datosOriginales - datos.length} de ${datosOriginales} pasos por formato inválido.`);
        }

        if (!Array.isArray(datos) || datos.length === 0) {
            console.error("❌ ejecutarProceso: se esperaba un array de eventos no vacío.");
            return;
        }

        window.ejecutarProcesoCancelado = false;
        console.log(`%c▶️ Iniciando ejecución de ${datos.length} pasos...`, "color: #2196f3; font-weight: bold; font-size: 13px;");
        console.log("%c⏹️ Para cancelar en cualquier momento, escribe: ejecutarProcesoCancelado = true", "color: #ff9800;");

        // Convierte timestamp "8:12:35 a.m." a milisegundos del día (para calcular deltas)
        function timestampAMs(ts) {
            const match = ts.match(/(\d+):(\d+):(\d+)\s*(a\.?m\.?|p\.?m\.?)/i);
            if (!match) return null;
            let [, h, m, s, ampm] = match;
            h = parseInt(h); m = parseInt(m); s = parseInt(s);
            ampm = ampm.toLowerCase().replace(/\./g, '');
            if (ampm === 'pm' && h !== 12) h += 12;
            if (ampm === 'am' && h === 12) h = 0;
            return ((h * 3600) + (m * 60) + s) * 1000;
        }

        // Busca el mejor elemento candidato para un evento dado
        function buscarElemento(evento) {
            const id = evento.id || '';
            const clase = evento.clase || '';
            const texto = evento.texto || '';
            const etiqueta = evento.etiqueta || '';

            // 1. Prioridad máxima: ruta de selector generada al grabar (ancla + posición entre hermanos)
            if (evento.selector_ruta) {
                try {
                    const porRuta = document.querySelector(evento.selector_ruta);
                    if (porRuta) return { elemento: porRuta, metodo: `Ruta: ${evento.selector_ruta}` };
                } catch (e) {
                    // selector inválido (ancla ya no existe con ese ID, etc.) -> seguimos con fallbacks
                }
            }

            // 2. ID real directo (si no es "Sin ID")
            if (id && id !== 'Sin ID') {
                const porId = document.getElementById(id);
                if (porId) return { elemento: porId, metodo: `ID #${id}` };
            }

            // 3. Selector por tag + clase completa
            let candidatos = [];
            if (clase && clase !== 'Sin Clase' && etiqueta) {
                const selectorClase = '.' + clase.trim().split(/\s+/).map(c => CSS.escape(c)).join('.');
                try {
                    candidatos = Array.from(document.querySelectorAll(etiqueta.toLowerCase() + selectorClase));
                } catch (e) {
                    candidatos = [];
                }
            }

            // Si hay texto, filtramos candidatos por texto exacto/parcial (mejora precisión)
            if (texto.length > 0) {
                const porTexto = candidatos.filter(el => el.innerText && el.innerText.trim().startsWith(texto.trim()));
                if (porTexto.length > 0) candidatos = porTexto;
            }

            if (candidatos.length === 1) {
                return { elemento: candidatos[0], metodo: `Clase única (${clase.split(' ')[0]}...)` };
            } else if (candidatos.length > 1) {
                // Ambiguo: tomamos el primero visible en el viewport como mejor intento
                const visibles = candidatos.filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });
                const elegido = visibles[0] || candidatos[0];
                return { elemento: elegido, metodo: `Clase ambigua (${candidatos.length} coincidencias, se eligió 1 visible)`, ambiguo: true };
            }

            // 4. Fallback final: buscar por texto exacto entre todos los elementos del mismo tag
            if (texto.length > 0 && etiqueta) {
                const todos = Array.from(document.getElementsByTagName(etiqueta));
                const porTexto = todos.find(el => el.innerText && el.innerText.trim().startsWith(texto.trim()));
                if (porTexto) return { elemento: porTexto, metodo: `Texto (fallback) "${texto.substring(0, 20)}..."` };
            }

            return null;
        }

        // Ejecuta un solo paso (evento) haciendo click
        function ejecutarPaso(evento, indice) {
            const id = evento.id || 'Sin ID';
            const clase = evento.clase || 'Sin Clase';
            const texto = evento.texto || '';
            const etiqueta = evento.etiqueta || '?';

            console.group(`%c[EJECUTANDO PASO ${indice + 1}/${datos.length}] ${evento.tipo || 'CLIC'} -> <${etiqueta}>`, 'color: #9c27b0; font-weight: bold;');

            const resultado = buscarElemento(evento);

            if (!resultado) {
                console.error(`❌ No se encontró el elemento. ID: ${id} | Clase: ${clase} | Texto: "${texto}"`);
                console.groupEnd();
                return false;
            }

            if (resultado.ambiguo) {
                console.warn(`⚠️ Coincidencia ambigua, revisa si hizo clic en el elemento correcto.`);
            }

            console.log(`✅ Elemento encontrado por: ${resultado.metodo}`);
            console.log(`📍 Elemento:`, resultado.elemento);

            try {
                resultado.elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                resultado.elemento.click();
                console.log(`🖱️ Clic ejecutado con éxito.`);
            } catch (err) {
                console.error(`❌ Error al hacer clic:`, err);
                console.groupEnd();
                return false;
            }

            console.groupEnd();
            return true;
        }

        // Ejecución secuencial asíncrona respetando tiempos
        (async function correr() {
            for (let i = 0; i < datos.length; i++) {
                if (window.ejecutarProcesoCancelado) {
                    console.log("%c⏹️ Ejecución cancelada por el usuario.", "color: #f44336; font-weight: bold;");
                    return;
                }

                let delay = config.delayMinimo;
                if (config.respetarTiempos && i > 0) {
                    const t1 = timestampAMs(datos[i - 1].timestamp);
                    const t2 = timestampAMs(datos[i].timestamp);
                    if (t1 !== null && t2 !== null) {
                        let diff = t2 - t1;
                        if (diff < 0) diff += 24 * 3600 * 1000; // cruce de medianoche
                        delay = Math.min(Math.max(diff / config.velocidad, config.delayMinimo), config.delayMaximo);
                    }
                }

                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                const exito = ejecutarPaso(datos[i], i);

                if (!exito && config.detenerSiFalla) {
                    console.log("%c🛑 Ejecución detenida (detenerSiFalla=true).", "color: #f44336; font-weight: bold;");
                    return;
                }
            }
            console.log("%c🏁 Ejecución del proceso finalizada.", "color: #4caf50; font-weight: bold; font-size: 13px;");
        })();
    };

    // Método alternativo de copiado usando un textarea temporal
    function copiarFallback(texto) {
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            const exito = document.execCommand('copy');
            if (exito) {
                console.log("%c📋 ¡Proceso copiado al portapapeles (fallback)!", "color: #4caf50; font-size: 13px; font-weight: bold;");
            } else {
                console.error("❌ No se pudo copiar automáticamente. Copia el JSON manualmente desde 'window.ProcesoLog'.");
            }
        } catch (err) {
            console.error("❌ Error al copiar:", err);
        }
        document.body.removeChild(textarea);
    }
})();
