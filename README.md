# 01 Dcrypto tests
Una aplicacion muestra para funcionalidades de WebSocket, Google Login y MFA con Google Authenticator.


## Paquetes principales del Front
Sobre el Front con React se usan los siquientes paquetes (exluyendo los especificos de cada modulo):
 - [axios] Para hacer mejores llamadas por http. _[MIT License](https://github.com/axios/axios/blob/master/LICENSE)_
 - [jsonwebtoken] Para decodificar y verifica el login con Google. _[MIT License](https://github.com/auth0/node-jsonwebtoken/blob/master/LICENSE)_
 - [react-qr-code] Para generar QR's, usado en MFA. _[MIT License](https://github.com/rosskhanas/react-qr-code/blob/master/LICENSE)_
 - [react-transition-group] animaciones css. _[BSD-3-Clause License](https://github.com/reactjs/react-transition-group/blob/master/LICENSE)_

Los demas paquetes y enlaces se encuentran en sus respectivas secciones de uso.




## Crypto dashboard
En el proyecto se usara informacion de: _Binance, Binance US, Coinbase, Bitso API_.

### Binance
Actualmente este front de prueba se realizó solo con Binance.

#### Limites
Los [limites de Binance] se separan segun el recurso al que se quiere acceder. 
Todos en general estan limitados y pasarse del limite puede terminar _baneando_ 
la direccion IP desde la que se accede.  
Se **recomienda usar más el WebSocket** ya que hay menos problemas con los limites.  
**Importante**
 - Si se recibe un ```429``` es necesario dejar de hacer peticiones ya que llegamos al limite.
 - No detener las peticiones despues de un ```429``` o excederse constantemente en los limites hara que el **IP sea baneado**, recibiendo status ```418``` en tal caso.
 - Un ```Retry-After``` es recibido en el header de las respuestas ```418``` o ```429``` indicando cuantos segundos hay que esperar antes de continuar.
##### Web Socket  
Para conexiones al WebSocket se tiene:
 - máximo **5 mensajes por segundo**, siendo un mensaje: 
  - un _PING frame_
	- un _PONG frame_
	- un mensaje _JSON_.
 - máximo **1024 streams por conexion**.
 - Una conexion a _stream.binance.com_ es solo **valida por 24 horas**, cumplido el tiempo se desconecta.
 - El WebSocket envia un _ping frame_ cada 3 minutos, si no se responde con un _pong frame_ en 10 minutos la conexion se desconecta.
  - Se permite enviar _pong frames_ sin que sean pedidos primero.
##### Rest API
Lo limites se separan en 2: ```/api/``` y ```/sapi/```  
**Para _/api/\*_**
 - 1200 peticiones por **minuto** por IP. _Excepcion para ```POST /api/v3/order``` que tiene limite de 50 por 10 segundos_.
 - Se puede ver en el _header_ de las respuestas las peticiones usada por la IP como ```X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)```.
**Para _/sapi/\*_**
 - El limite de uso de cada _endpoints_ se va contando segun **IP** y **UID**, cada uno independiente.
 - 12'000 peticiones por minuto para **IP**
 - 180'000 peticiones por minuto para **UID**
 - Las respuestas para _endpoints_ con limite por **IP** contienen en el _header_ ```X-SAPI-USED-IP-WEIGHT-1M``` con lo que se ha usado.
 - Las respuestas para _endpoints_ con limite por **UID** contienen en el _header_ ```X-SAPI-USED-UID-WEIGHT-1M``` con lo que se ha usado.

#### Uso del API
Se uso tanto el Rest API para obtener todos los cambios disponibles de monedas (conocidos de aqui adelante como **_symbols_**). 
_Ticker_ es la informacion sobre un _symbol_
##### Rest API
Para el **Rest API** se tiene un **[swagger](https://binance.github.io/binance-api-swagger/).**
Usamos:
 - [Ticker Price Api](https://binance.github.io/binance-api-swagger/#/Market/get_api_v3_ticker_price) para obtener todos los _symbols_.
##### Web Socket 
Para el **Web Socket** se usan las guias del **[github](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md)**.
Usamos:
 - [Raw streams](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#general-wss-information) para hacer la conexion inicial a algun stream y despues ya se puede subscribir a adicionales sobre ese mismo WebSocket.
  - Los _raw streams_ se pueden acceder como ```wss://stream.binance.com:9443/ws/<streamName>```.
 - [Subscripciones](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#live-subscribingunsubscribing-to-streams) para poder seleccionar los _streams_ que nos interesaban.
  - Las subscriciones se hacen con un request a algun _websocket_ que ya este conectado. Son en el formato:
	```javascript
	{
		"method": "SUBSCRIBE",
		"params": [
			"<streamName>",
			"<symbol>@example"
		],
		"id": 1
	}
	```
 - [Ticker Streams individuales de cada symbol](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#individual-symbol-ticker-streams) para obtener informacion especifica de los _symbols_ que nos interesaran.
  - Una **alternativa a lo anterior** es un [Stream de todos los symbols](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#all-market-tickers-stream), **pero** solo regresa los _symbols_ que hayan cambiado, por lo que es tarea interna observar que elementos cambiaron y actualizarlos.



### Coinbase
El [api](https://docs.cloud.coinbase.com/exchange/docs) de Coinbase cuenta con **[REST API](https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getaccounts)** y **[WebSocket](https://docs.cloud.coinbase.com/exchange/docs/overview)**.
Se necesita una cuenta de [Exchange](https://pro.coinbase.com/) para acceder al REST API. El WebSocket se menciona ser publico, pero hay que considerar sus limites.
#### Limites
Los limites son diferentes segun a lo que se accede
##### Rest API
Para el Rest Api se tienen los [limites](https://docs.cloud.coinbase.com/exchange/docs/rate-limits):
 - A _endpoints_ **publicos** hay un máximo de **10** _requests_ por segundo, hasta **15** _requests_ por segundo en rafagas. **Algunos _endpoints_ tienen limites personalizados**.
 - A _endpoints_ **privados** hay un máximo de **15** _requests_ por segundo, hasta **30** _requests_ por segundo en rafagas. **Algunos _endpoints_ tienen limites personalizados**.
 - Máximo 7 conexiones por perfil.
 - Coinbase usa unos _[tokens](https://docs.cloud.coinbase.com/exchange/docs/rate-limits#how-it-works)_ para permitir el uso de la API asi como unas rafagas de informacion extra.
##### WebSocket
Como se mencionó el WebSocket es público pero tiene unos [limites](https://docs.cloud.coinbase.com/exchange/docs/overview):
 - Las conexiones estan limitadas a **1 cada 4 segundos por IP**.
  - Los mensajes enviados por el cliente estan limitados a **100 por segundo por IP**.   

Se puede [autenticar](https://docs.cloud.coinbase.com/exchange/docs/overview#authentication) con una cuenta hacia el WebSocket para recibir informacion adicional en algunos mensajes.


### Bitso
Bitso cuenta con su propia [api](https://bitso.com/api_info), conteniendo un **[REST API](https://bitso.com/developers#public-rest-api)** y **[WebSocket](https://bitso.com/developers#websocket-api)**.
Hay un **[Private Rest Api](https://bitso.com/api_info#private-rest-api)** para operaciones relacionadas a una cuenta de usuario especifica.
#### Limites
##### Rest API
Para el Rest Api se tienen los [limites](https://bitso.com/developers#rate-limits):
 - Los limites se basan en ventanas de 1 minuto.
 - Para la **API Publica** se limita por direccion **IP** a máximo 60 peticiones por minuto.
 - Para la **API Privada** se limita por **usuario** a máximo 300 peticiones por minuto.
 - Si se **excede** sera bloqueado por un minuto, excederse constantemente puede bloquearlo hasta **24 horas**.
 - Las cancelaciones de ordenes no estan limitadas por la API.
##### WebSocket
Para el WebSocket no se mencionan limites mas haya de los streams a los cuales subscribirse, aunque sí se menciona el uso de mensajes _keep alive_ de la forma: ```{"type":"ka"}```



## MFA  
Autenticacion Multi Factor (MFA)
### Paquetes principales
Se usan los paquetes:
 - [thirty-two] para códificar en [Base32 (RFC3548)]. _[MIT License](https://github.com/chrisumbel/thirty-two/blob/master/LICENSE.txt)_
 - [notp] para generar y validar claves [HOTP (RFC4226)] y [TOTP (RFC6238)]. _[MIT License](https://github.com/guyht/notp/blob/master/LICENSE)_

### Google Authenticator
La MFA se hace con enfasis a **Google Authenticator**.  
Para emparejar se debe encodificar en Uri un enlace segun [esta referencia](https://github.com/google/google-authenticator/wiki/Key-Uri-Format):  
**Formato:**
> otpauth://TYPE/LABEL?PARAMETERS
 - **Type** Es el tipo de clave, puede ser ```hotp``` o ```totp```
 - **Label** Es el identificador del usuario y el proveedor del servicio. Puede omitirse el issuer. Formato:
 >label = ```accountname / issuer (“:” / “%3A”) *”%20” accountname```
 >Ejemplos: ```john@gmail.com```, ```IssuerA:John%20Doe``` o ```Issuer%20Corp.%3A%20john%40corp.com```
 - **Parameters** parametros extra, algunos son opcionales.  
	- ```secret``` es la llave secreta con la que vinculamos al usuario, debe ser en **[Base32 (RFC3548)]** y **sin** el signo de igual ```=```.
	- ```issuer``` igual al de Label, se repite para evitar ambigüedades.
	- ```algorithm``` _OPCIONAL_ El algoritmo usado. Default ```SHA1```.
	- ```digits``` _OPCIONAL_ Longitud que debera tener la contraseña que genera Google Authenticator. Default ```6```.
	- ```counter``` _SOLO EN HOTP_ Se necesita para especificar el inicio del contador al usar HOTP.
	- ```period``` _OPCIONAL_ El tiempo que sera valido el codigo TOTP. Default ```30```.

### Inspiraciones
Unos ejemplos o inspiraciones de autenticadores MFA:
 - [Google Authenticator Api]
 - [ppl Authenticator]




## Unit Tests  
### Paquetes principales
Para pruebas se usan: 
 - [Jest]
 - [React Testing Library]

### Recomendaciones  
Para pruebas mas robustas se recomiendan: 
 - [jest-dom]
 - [jest-websocket-mock]

Para buscar por roles o tipos de elementos consultar: [html-aria].


[//]: # (Enlaces usados---------------------------------------------------------)
[//]: # (Front-------------------)
[axios]: <https://axios-http.com/docs/intro> 
[axios License: MIT]: <https://github.com/axios/axios/blob/master/LICENSE>
[jsonwebtoken]: <https://github.com/auth0/node-jsonwebtoken#readme>
[jwt License: MIT]: <https://github.com/auth0/node-jsonwebtoken/blob/master/LICENSE>
[react-qr-code]: <https://github.com/rosskhanas/react-qr-code#readme>
[rqc License: MIT]: <https://github.com/rosskhanas/react-qr-code/blob/master/LICENSE>
[react-transition-group]: <https://github.com/reactjs/react-transition-group>
[rtg License: BSD-3-Clause]: <https://github.com/reactjs/react-transition-group/blob/master/LICENSE>

[//]: # (Crypto-------------------)
[limites de Binance]: <https://binance-docs.github.io/apidocs/spot/en/#limits>

[//]: # (MFA-------------------)
[thirty-two]: <https://github.com/chrisumbel/thirty-two#readme>
[Base32 (RFC3548)]: <https://datatracker.ietf.org/doc/html/rfc3548>
[notp]: <https://github.com/guyht/notp>
[HOTP (RFC4226)]: <https://datatracker.ietf.org/doc/html/rfc4226>
[TOTP (RFC6238)]: <https://datatracker.ietf.org/doc/html/rfc6238>

[Google Authenticator Api]: <http://authenticatorapi.com/>
[ppl Authenticator]: <https://rootprojects.org/authenticator/>

[//]: # (Tests-------------------)
[Jest]: <https://jestjs.io/>
[React Testing Library]: <https://testing-library.com/docs/react-testing-library/intro/>

[jest-dom]: <https://github.com/testing-library/jest-dom>
[jest-websocket-mock]: <https://github.com/romgain/jest-websocket-mock#readme>

[html-aria]: <https://www.w3.org/TR/html-aria/#docconformance>

[//]: # (Extras------------------)
[Markdown Syntax CheatSheet]: <https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf>