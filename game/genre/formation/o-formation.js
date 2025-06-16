export default (xPosition, yPosition, unitCount, unitSpacing) => {
    const results = {};

    const slots = 12;
    const angleStep = (2 * Math.PI) / slots;
    const radius = unitSpacing;

    const unitsPerRow = 4;
    const unitsPerCol = Math.ceil(unitCount / unitsPerRow);

    // Precompute grid positions
    const gridOrder = [];
    for (let row = 0; row < unitsPerCol; row++) {
        for (let col = 0; col < unitsPerRow; col++) {
            const index = row * unitsPerRow + col;
            if (index < unitCount) {
                gridOrder.push(index);
            }
        }
    }

    // Map index -> slot based on grid position
    for (let i = 0; i < gridOrder.length; i++) {
        const index = gridOrder[i];
        const slot = i % slots;
        const angle = slot * angleStep;

        const unitX = xPosition + radius * Math.cos(angle - Math.PI / 2);
        const unitY = yPosition + radius * Math.sin(angle - Math.PI / 2);

        results[index] = {
            xPosition: unitX,
            yPosition: unitY,
        };
    }

    return results;
};