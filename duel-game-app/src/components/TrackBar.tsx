import React, { memo } from 'react';

interface TrackbarProps {
    min: number;
    max: number;
    step: number;
    initialValue: number;
    id: string;
    title: string;
    handleChange: (value: number, propName: string) => void;
}

const Trackbar = memo(({ min, max, step, initialValue, id, title, handleChange }: TrackbarProps) => {
    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(Number(e.target.value), id)
    }
    return (
        <div>
            <label htmlFor={`${id}_trackbar`}>
                {`${title}`} Speed:
            </label>
            <input
                type="range"
                id={`${id}_trackbar`}
                min={min}
                max={max}
                step={step}
                value={initialValue}
                onChange={changeValue}
            />
            <span id={`${id}_trackbar_value`}>
                {initialValue}x
            </span>
        </div>
    );
});

export default Trackbar;