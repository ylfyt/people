import { FunctionComponent, MouseEvent, ReactNode } from 'react';

enum buttonSize {
    xs = 'dai-btn-xs',
    sm = 'dai-btn-sm',
    md = 'dai-btn-md',
    lg = 'dai-btn-lg',
}
enum loadingSize {
    xs = 'dai-loading-xs',
    sm = 'dai-loading-sm',
    md = 'dai-loading-md',
    lg = 'dai-loading-lg',
}

type SizeMap = {
    [K in keyof typeof buttonSize]: (typeof buttonSize)[K];
};

interface LoadingButtonProps {
    size?: keyof SizeMap;
    loading?: boolean;
    type?: "button" | "submit" | "reset" | undefined;
    disabled?: boolean;
    disabledWhenLoading?: boolean;
    className?: string;
    onClick?: (e: MouseEvent) => void;
    children?: ReactNode;
}

export const LoadingButton: FunctionComponent<LoadingButtonProps> = ({ onClick, disabled = false, disabledWhenLoading = true, loading = false, type, size = "md", className, children }) => {
    return (
        <button
            onClick={(e) => onClick && onClick(e)}
            disabled={disabled || (disabledWhenLoading && loading)}
            type={type}
            className={`${buttonSize[size]} dai-btn relative ${className}`}
        >
            <span className={`${loading ? 'invisible' : 'visible'}`}>
                {children}
            </span>
            {
                loading &&
                <span
                    className={`${loadingSize[size]} dai-loading dai-loading-spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary`}
                ></span>
            }
        </button>
    );
};