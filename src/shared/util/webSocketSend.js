//wrapper to avoid looping
// expects:
//		ws - the websocket
//		msg/message , func/function to be run
//		maxCounter - the maximum amount of tries, CONSIDER the time
//	 by default this will only retry for a ~second (50*20)
export const wsSend = (ws, msg, func = () => { }, maxCounter = 20) => {
	awaitConnection(ws, msg, func, 0, maxCounter);
};

//awaits the connection
export const awaitConnection = (ws, msg, func, counter, maxCounter) => {
	if (ws.readyState === 1) {
		ws.send(msg)
		func()
	} else if (counter <= maxCounter) {
		setTimeout(() => {
			awaitConnection(ws, msg, func, counter + 1, maxCounter)
		}, 50)
	} else {
		console.error('TIMEOUT - No se pudo enviar la conexion.');
	}
};
