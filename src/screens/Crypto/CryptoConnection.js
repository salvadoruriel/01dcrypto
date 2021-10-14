import axios from "axios";

import { wsSend } from "../../shared/util/webSocketSend";

const baseApiUrl = 'https://api.binance.com'
const baseWSUrl = 'wss://stream.binance.com:9443'

//Binance
//loaded should be a ref hook
export const getSymbols = (setSymbols, loaded) => {
	axios.get(`${baseApiUrl}/api/v3/ticker/price`)
		.then((response) => {
			//console.log(response)

			//for current aesthetic, Im only looking for the exchange to USD
			//	can be updated to regex after checking properly all data
			let newData = response.data.filter(item => {
				let is = item.symbol
				return is.includes('USD') &&
					!item.symbol.includes('USDT') &&
					!item.symbol.includes('USDC') &&
					!item.symbol.includes('USDP') &&
					!item.symbol.includes('TUSD')
			})
			//console.log(newData);
			setSymbols(newData);

			loaded.current = true
		})
		.catch(error => {
			console.error('[getSymbols] Error:', error)
		});
}

export const binanceConnect = (ws, symbols, setData) => {
	ws.current = new WebSocket(baseWSUrl + '/ws/btcusd@ticker');

	ws.current.onopen = event => {
		console.log('Conexion establecida.')

		let sub = {
			method: "SUBSCRIBE",
			params: [],
			id: 1
		}
		//can have only a maximum of 1024 stream
		symbols.slice(0, 1021).forEach(item => {
			sub.params.push(item.symbol.toLowerCase() + '@ticker')
		});

		//ws.current.send(JSON.stringify(sub)) //fails to make connection on time to send
		wsSend(ws.current, JSON.stringify(sub), console.log('[wsSend] Exito'), 500);
	};

	ws.current.onmessage = e => {
		let data = JSON.parse(e.data);
		//console.log('data', data); //useful on the test
		//ignoring the standard message returned
		if (data.result === null) return;

		let newData = {
			id: data.s,
			symbol: data.s,
			price: data.c,
			change: data.p,
			changePercent: data.P
		}
		setData(prevData => {
			let index = prevData.findIndex(x => x.symbol === newData.symbol);
			if (index === -1) return [...prevData, newData];
			else return [
				...prevData.slice(0, index),
				{ ...prevData[index], ...newData },
				...prevData.slice(index + 1, prevData.length)
			]
		})
	};

	setTimeout(() => {
		console.log('Cerrando conexion.')
		ws.current.close();
	}, 1* 10 * 1000);
	ws.current.onclose = e => {
		console.log('Conexion cerrada.');
	};

	ws.current.onerror = e => {
		console.error('[binanceConnect] Error: ', e);
	};
}

//Binance WebTickets
//These only display changes, so its not reliable for proper output
export const binanceTicketConnect = (ws, setData) => {
	ws.current = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

	ws.current.onopen = event => {
		console.log('Conexion establecida.')
	};

	ws.current.onmessage = e => {
		let data = JSON.parse(e.data);
		console.log(data);
		let newData = data.filter(item => item.s.includes('USD'))
		newData = newData.filter(item => !item.s.includes('USDT'))
		newData = newData.filter(item => !item.s.includes('USDC'))
		setData(newData.map(item => {
			return {
				symbol: item.s,
				price_usd: item.c
			}
		}))
	};

	setTimeout(() => {
		console.log('Cerrando conexion.')
		ws.current.close();
	}, 30 * 1000)

	ws.current.onerror = e => {
		console.error('Hubo un error', e.data);
	};
}

//Binance CHAIN, note this is different
//	from docs: (https://docs.binance.org/api-reference/dex-api/ws-connection.html)
//	https://docs.binance.org/api-reference/dex-api/ws-streams.html#9-all-symbols-ticker-streams
export const binanceChainConnect = (ws, func) => {
	ws.current = new WebSocket('wss://dex.binance.org/api/ws/$all@allTickers');

	ws.current.onopen = event => {
		console.log('Conexion establecida')
	};

	ws.current.onmessage = e => {
		let data = JSON.parse(e.data);
		console.log(data);
	}
	setInterval(() => {
		//on Binance the connection is reset every 30 minutes
		console.log('Reanudando conexion.')
		ws.current.send(JSON.stringify({ method: "keepAlive" }))
	}, 30 * 60 * 1000);

	setTimeout(() => {
		console.log('Cerrando conexion.')
		ws.current.send(JSON.stringify({ method: "close" }))
	}, 3 * 1000)

	ws.current.onerror = e => {
		console.error('Hubo un error', e.data);
	};
}