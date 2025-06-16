export default (xPosition, yPosition, unitCount, unitSpacing) =>  {
     const unitsPerRow = 4;

     let results = {};
     for (let i = 0; i < unitCount; i++) {
        const row = Math.floor(i / unitsPerRow);
        const col = i % unitsPerRow;

        const unitX = xPosition + col * unitSpacing;
        const unitY = yPosition + row * unitSpacing;

        results[i] = {
            xPosition: unitX,
            yPosition: unitY,
        }
     }

     return results;
}