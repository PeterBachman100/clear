export default function UnitSelection({ availableUnits, units, onChange }) {
	const handleUnitChange = (category, value) => {
		onChange(prev => ({
			...prev,
			[category]: value
		}));
	};

	return (
		<div>
			<h3>Units</h3>
			{Object.entries(availableUnits).map(([category, unitOptions]) => (
				<div key={category}>
					<strong>{category}</strong>
					<div>
						{unitOptions.map(({ label, value }) => (
							<label key={value}>
								<input 
									type="radio"
									name={category}
									value={value}
									checked={units[category] === value}
									onChange={() => handleUnitChange(category, value)}
								/>
								{label}
							</label>
						))}
					</div>
				</div>
			))}
		</div>
	);
}