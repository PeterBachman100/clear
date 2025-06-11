import{ Box, Slider, Typography } from '@mui/material';

export default function ForecastLengthInput( {forecastLength, onChange}) {
    return (
        <Box sx={{maxWidth: 300}}>
            <Typography variant='h6'>
                Forecast Length: {forecastLength} Day{forecastLength > 1 ? 's' : ''}
            </Typography>
            <Slider 
                value={Number(forecastLength)}
                min={1}
                max={16}
                step={1}
                onChange={onChange}
                valueLabelDisplay='auto'
                marks
            />
        </Box>
    );
}
