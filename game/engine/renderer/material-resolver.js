export default class MaterialResolver {
    constructor(materialRegistry) {
        this.materialRegistry = materialRegistry;
    }

    resolve(drawCommand, context = {}) {
        let firstMatch = null;
        this.materialRegistry.list().forEach((material) => {
            if (firstMatch) {
                return;
            }
            if (material.resolver) {
                firstMatch = material.resolver(drawCommand, context);
            }
        })
        
        return firstMatch || 'basic-quad';
    }
}