import {
    createTable,
    type RowData,
    type TableOptions,
    type TableOptionsResolved,
} from '@tanstack/table-core';
import * as React from 'react';

const defaultOptions = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
};

export function useSafeReactTable<TData extends RowData>(
    options: TableOptions<TData>,
) {
    const resolvedOptions: TableOptionsResolved<TData> = {
        ...defaultOptions,
        ...options,
    };

    const [table] = React.useState(() => createTable<TData>(resolvedOptions));

    const [state, setState] = React.useState(() => table.initialState);

    table.setOptions((prev) => ({
        ...prev,
        ...options,
        state: {
            ...state,
            ...options.state,
        },
        onStateChange: (updater) => {
            setState(updater);
            options.onStateChange?.(updater);
        },
    }));

    return table;
}
