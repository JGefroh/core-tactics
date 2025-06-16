export default (xPosition, yPosition, unitCount, unitSpacing) => {
    const results = {};

    const totalHeight = (unitCount - 1) * unitSpacing;
    const startY = yPosition - totalHeight / 2;

    for (let i = 0; i < unitCount; i++) {
        const unitX = xPosition; // Stay on same X
        const unitY = startY + i * unitSpacing;

        results[i] = {
            xPosition: unitX,
            yPosition: unitY,
        };
    }

    return results;
};