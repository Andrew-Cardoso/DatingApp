const recursiveClone = <T>(value: T): T => {
	if (!value || ['number', 'string'].includes(typeof value)) return value;

	if (Array.isArray(value)) return <T><unknown>value.map(x => recursiveClone(x));

	const clonedObject: Partial<T> = {};
	for (const key in value) clonedObject[key] = recursiveClone<T[Extract<keyof T, string>]>(value[key]);

	return clonedObject as T;
};
export const clone = <T>(object: T): T => recursiveClone<T>(object);