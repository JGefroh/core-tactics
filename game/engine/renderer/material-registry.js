export default class MaterialRegistry {
  constructor() {
    this.materials = {};
  }

  register(materialId, config) {
    this.materials[materialId] = config;
  }

  get(materialId) {
    return this.materials[materialId];
  }

  list() {
    return Object.values(this.materials);
  }
}