import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButtons({ title, handleAction, color='primary', variant='contained' }) {
    return (
        <Button variant={variant} color={color} onClick={handleAction}>{title}</Button>
    );
}