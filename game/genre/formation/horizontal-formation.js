export default (xPosition, yPosition, unitCount, unitSpacing) => {
    const results = {};

    const totalWidth = (unitCount - 1) * unitSpacing;
    const startX = xPosition - totalWidth / 2;

    for (let i = 0; i < unitCount; i++) {
        const unitX = startX + i * unitSpacing;
        const unitY = yPosition; // Stay on same Y

        results[i] = {
            xPosition: unitX,
            yPosition: unitY,
        };
    }

    return results;
};