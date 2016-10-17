/**
 *
 */
function Resolver(entity, id, field) {
  this.entity = entity;
  this.id = id;
  this.field = field;
}

Resolver.prototype.getCacheKey = function(id) {
  return `${this.entity}_${this.field}_${id}`;
};

module.exports = Resolver;
