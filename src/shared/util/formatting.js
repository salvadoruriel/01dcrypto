//formating here to keep it consistent across the app
export const decimalFormat = (value) => {
	let parsed = parseFloat(value)
	if(isNaN(parsed)) return parsed;
	else if (parsed >= 1) return parsed.toFixed(2);
	else if (parsed >= 0.1) return parsed.toFixed(3);
	else if (parsed >= 0.01) return parsed.toFixed(4);
	else if (parsed >= 0.001) return parsed.toFixed(5);
	else return parsed;
}

export const colorFormat = (value) => {
	let parsed = parseFloat(value)
	if (isNaN(parsed) || parsed === 0) return '';
	else if (parsed > 0) return 'data-valuePositive';
	else return 'data-valueNegative';
}