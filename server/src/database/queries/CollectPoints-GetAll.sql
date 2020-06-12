-- SQLite
SELECT *
FROM items
JOIN collectPointItemRelations ON collectPointItemRelations.itemId = items.itemId
JOIN collectPoints ON collectPoints.collectPointId = collectPointItemRelations.collectPointId