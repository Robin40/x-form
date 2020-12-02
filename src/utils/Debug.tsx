import React from 'react';

function Debug({ value }: { value: any }) {
    return (
        <pre style={{ maxWidth: '40em' }}>
            {JSON.stringify(value, getReplacer(), '  ')}
        </pre>
    );
}

// based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
const getReplacer = () => {
    const seen = new WeakSet();
    return (_key: string, value: any) => {
        // handle react elements
        if (
            typeof value === 'object' &&
            value !== null &&
            '$$typeof' in value &&
            value.type?.name
        ) {
            return `<${value.type.name}/>`;
        }

        // handle circular references
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '...';
            }
            seen.add(value);
        }

        return value;
    };
};

export default Debug;
