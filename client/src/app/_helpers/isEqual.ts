const recursiveIsEqual = (value1: unknown, value2: unknown, compareCase: boolean, compareType: boolean): boolean => {

	const recurse = (val1: unknown, val2: unknown) => recursiveIsEqual(val1, val2, compareCase, compareType);
	
	/* Check for null or undefined */
	if (!value1 || !value2) {
		if (!value1 && !value2) return true;
		return false;
	}

	/* Check and compare primitive types */
	if ([typeof value1, typeof value2].some((type) => ['number', 'string', 'boolean'].includes(type))) {
		if (!compareCase)
			return compareType
				? ((value1 as string).toLowerCase?.() ?? value1) === ((value2 as string).toLowerCase?.() ?? value2)
				: ((value1 as string).toLowerCase?.() ?? value1) == ((value2 as string).toLowerCase?.() ?? value2);
		return compareType ? value1 === value2 : value1 == value2;
	}

	/* Check and compare arrays */
	const isValue1Array = Array.isArray(value1);
	const isValue2Array = Array.isArray(value2);
	
	if (isValue1Array !== isValue2Array) return false;

	if (isValue1Array) {
		const value1Length = (value1 as unknown[]).length;
		const value2Length = (value2 as unknown[]).length;

		if (value1Length !== value2Length) return false;

		for (let i = 0; i < value1Length; i++) if (!recurse(value1[i], value2[i])) return false;
		return true;
	}

	/* Check for empty object */
	const val1Length = Object.keys(value1).length;
	const val2Length = Object.keys(value2).length;

	if (val1Length === 0 || val2Length === 0) {
		if (val1Length === val2Length) return true;
		return false;
	}

	/* Compare key by key */
	for (const key in (value1 as object)) {
		if (!(key in (value2 as object))) return false;
		if (!recurse(value1[key], value2[key])) return false;
	}
	return true;
};

export const isEqual = (object: unknown, object2: unknown, compareCase = true, compareType = true): boolean => recursiveIsEqual(object, object2, compareCase, compareType);
