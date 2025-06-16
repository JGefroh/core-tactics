export default (xPosition, yPosition, unitCount, unitSpacing) => {
    const results = {};
    const radius = 200; // distance from center to each group vertex
    const groups = 3;
    const angleOffset = Math.PI / 2; // start with group1 pointing up

    // Calculate group centers at triangle vertices
    const groupCenters = Array.from({ length: groups }, (_, i) => {
        const angle = angleOffset + (i * 2 * Math.PI) / groups;
        return {
            x: xPosition + radius * Math.cos(angle),
            y: yPosition + radius * Math.sin(angle),
        };
    });

    // Distribute units evenly across groups
    const baseUnitsPerGroup = Math.floor(unitCount / groups);
    const remainder = unitCount % groups;

    let unitIndex = 0;

    groupCenters.forEach((center, groupIndex) => {
        const unitsInGroup = baseUnitsPerGroup + (groupIndex < remainder ? 1 : 0);

        for (let i = 0; i < unitsInGroup; i++) {
            results[unitIndex] = {
                xPosition: center.x + (i * unitSpacing),
                yPosition: center.y
            };
            unitIndex++;
        }
    });

    return results;
};