import { Stack, Typography, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function UnitSelection({ availableUnits, units, onChange }) {
	const handleUnitChange = (category, value) => {
		onChange(prev => ({
			...prev,
			[category]: value
		}));
	};

	return (
		<div>
			<Typography variant="h6">Units</Typography>
			<Stack spacing={2}>
				{Object.entries(availableUnits).map(([category, unitOptions]) => (
					<FormControl component="fieldset" key={category}>
						<FormLabel component="legend" sx={{ textTransform: 'capitalize' }}>{category}</FormLabel>
						<RadioGroup
							row
							name={category}
							value={units[category]}
							onChange={(e) => handleUnitChange(category, e.target.value)}
						>
							{unitOptions.map(({ label, value }) => (
								<FormControlLabel
									key={value}
									value={value}
									control={<Radio />}
									label={label}
								/>
							))}
						</RadioGroup>
					</FormControl>
				))}
			</Stack>
		</div>
	);
}