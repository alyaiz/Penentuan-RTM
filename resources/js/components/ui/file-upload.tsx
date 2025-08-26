import { cn } from '@/lib/utils';
import * as React from 'react';

interface FileUploadProps extends Omit<React.ComponentProps<'input'>, 'type'> {
    className?: string;
    placeholder?: string;
    buttonText?: string;
}

function FileUpload({ className, placeholder = 'No file chosen', buttonText = 'Choose File', ...props }: FileUploadProps) {
    const [fileName, setFileName] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : '');
        props.onChange?.(e);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={cn('relative flex items-center', className)}>
            <input
                ref={inputRef}
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
                {...props}
            />

            <div className="border-input bg-background flex h-9 w-full items-center rounded-md border text-sm">
                <button
                    type="button"
                    onClick={handleClick}
                    className={cn(
                        'border-input bg-muted inline-flex h-7 items-center justify-center rounded-l border-r px-3 ml-[3px] text-xs font-medium',
                        'hover:bg-accent hover:text-accent-foreground transition-colors',
                        'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    )}
                >
                    {buttonText}
                </button>

                <div className="text-muted-foreground flex-1 px-3 py-1 truncate w-10">{fileName || placeholder}</div>
            </div>
        </div>
    );
}

export { FileUpload };
