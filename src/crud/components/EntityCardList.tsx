// packages/expo/src/crud/components/EntityCardList.tsx
/**
 * @fileoverview Entity Card List Component for Expo
 * @description Card grid view for public/user-facing entity browsing using React Native components
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { useTranslation, getListCardFieldNames } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import type { EntityCardListProps } from '@donotdev/core';
import {
  translateFieldLabel,
  useCrudCardList,
  useEntityFavorites,
  useCrudFilters,
} from '@donotdev/crud';

import { formatValue } from './DisplayFieldRenderer';
import { EntityFilters, matchesFilter } from './EntityFilters';
import {
  Grid,
  Card,
  Stack,
  Text,
  Spinner,
  Section,
  Button,
} from '../../atomic';
import { useNavigate } from '../../routing';
import { useTheme } from '../../theme';

export type { EntityCardListProps };

/**
 * Entity Card List Component - Card grid view for public/user-facing browsing
 *
 * Features:
 * - Responsive card grid layout
 * - Image + key fields display
 * - Click card to navigate to detail
 * - Simple formatted text display (labels + values)
 * - Empty state handling
 * - Auto-routing when handler not provided
 */
export function EntityCardList({
  entity,
  basePath,
  onClick,
  cols = [1, 2, 3, 4],
  staleTime = 1000 * 60 * 30, // 30 minutes default cache
  filter,
  hideFilters = false,
}: EntityCardListProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const base = basePath ?? `/${entity.collection}`;

  // useCrudCardList -> handles fetching optimized for cards automatically
  const { data: listData, loading } = useCrudCardList(entity, { staleTime });
  const rawData = listData?.items || [];

  // Favorites - always enabled, no props needed
  const { isFavorite, toggleFavorite, favoritesFilter } = useEntityFavorites({
    collection: entity.collection,
  });

  // Favorites toggle from CrudStore (persists across navigation)
  const { showFavoritesOnly, setShowFavoritesOnly } = useCrudFilters({
    collection: entity.collection,
  });

  // Get filters for applying to data (EntityFilters manages its own state)
  const { filters } = useCrudFilters({
    collection: entity.collection,
  });

  // Apply filters from EntityFilters component
  const applyFilters = useCallback(
    (item: any): boolean => {
      if (Object.keys(filters).length === 0) return true;

      return Object.entries(filters).every(([fieldName, filterValue]) => {
        const itemValue = item[fieldName];
        const fieldConfig = entity.fields[fieldName];
        const fieldType = fieldConfig?.type || 'text';
        return matchesFilter(itemValue, filterValue, fieldType);
      });
    },
    [filters, entity.fields]
  );

  // Apply client-side filtering (including favorites)
  const data = useMemo(() => {
    let result = rawData;
    result = result.filter(applyFilters);
    // Apply favorites filter if enabled
    if (showFavoritesOnly) {
      result = result.filter(favoritesFilter);
    }
    if (filter) {
      result = result.filter(filter);
    }
    return result;
  }, [rawData, applyFilters, showFavoritesOnly, favoritesFilter, filter]);

  // Entity + crud namespaces so formatValue can resolve crud:price.* etc.
  const { t } = useTranslation([entity.namespace, 'crud']);
  const { t: tCrud } = useTranslation('crud');

  // Card click: onClick(id) if provided, else navigate to basePath/:id
  const handleView = useCallback(
    (id: string) => {
      if (onClick) {
        onClick(id);
      } else {
        navigate(`${base}/${id}`);
      }
    },
    [base, navigate, onClick]
  );

  // Determine which fields to show in cards (supports string[] and ListCardLayout)
  const fieldsToShow = useMemo(() => getListCardFieldNames(entity), [entity]);

  // Find image field
  const imageField = useMemo(() => {
    const imageFieldsInList = fieldsToShow.filter((fieldName) => {
      const fieldConfig = entity.fields[fieldName];
      return fieldConfig?.type === 'image' || fieldConfig?.type === 'images';
    });
    if (imageFieldsInList.length > 0) return imageFieldsInList[0];

    // Fallback: search all entity fields
    const allImageFields = Object.keys(entity.fields).filter((fieldName) => {
      const fieldConfig = entity.fields[fieldName];
      return fieldConfig?.type === 'image' || fieldConfig?.type === 'images';
    });
    return allImageFields[0] || null;
  }, [fieldsToShow, entity.fields]);

  // Get other fields (non-image)
  const otherFields = useMemo(() => {
    return fieldsToShow.filter((fieldName) => fieldName !== imageField);
  }, [fieldsToShow, imageField]);

  const entityName = t('name', { defaultValue: entity.name });

  return (
    <Stack gap={theme.spacing.md}>
      {/* Filters Section */}
      {!hideFilters && (
        <Section
          title={tCrud('filters.title', {
            entity: entityName,
            defaultValue: `Browse ${entityName} - Filters`,
          })}
          collapsible
          defaultCollapsed={false}
        >
          <Stack gap={theme.spacing.md}>
            {/* Favorites Toggle */}
            <Button
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              {showFavoritesOnly
                ? tCrud('favorites.showAll', { defaultValue: 'Show All' })
                : tCrud('favorites.showFavorites', {
                    defaultValue: 'Show Favorites',
                  })}
            </Button>

            <EntityFilters
              entity={entity}
              data={rawData}
              fieldsToFilter={fieldsToShow}
            />
          </Stack>
        </Section>
      )}

      {/* Results Section */}
      <Section
        title={
          loading
            ? tCrud('results.title.fetching', { defaultValue: 'Fetching...' })
            : tCrud('results.title.count', {
                count: data.length,
                defaultValue:
                  data.length === 1
                    ? 'Found 1 occurrence'
                    : `Found ${data.length} occurrences`,
              })
        }
        collapsible
        defaultCollapsed={false}
      >
        {loading ? (
          <Stack
            align="center"
            justify="center"
            style={{ padding: theme.spacing.lg }}
          >
            <Spinner />
          </Stack>
        ) : data.length === 0 ? (
          <Stack
            align="center"
            justify="center"
            style={{ padding: theme.spacing.lg }}
          >
            <Text level="h3" variant="muted">
              {tCrud('emptyState.title', {
                defaultValue: `No ${entity.name.toLowerCase()} found`,
              })}
            </Text>
            <Text variant="muted">
              {tCrud('emptyState.description', {
                defaultValue: `No ${entity.name.toLowerCase()} available at this time.`,
              })}
            </Text>
          </Stack>
        ) : (
          <Grid cols={cols}>
            {data.map((item: any) => {
              const imageValue = imageField ? item[imageField] : null;
              const imageUrl: string | null =
                typeof imageValue === 'string' ? imageValue : null;

              if (imageField && !imageUrl) {
                console.warn(
                  `[EntityCardList] Image field "${imageField}" is null/undefined for item "${item.id}".`
                );
              }

              // Title from first non-image field
              const titleField = otherFields[0];
              const titleValue = titleField ? item[titleField] : item.id;

              const itemIsFavorite = isFavorite(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleView(item.id)}
                  activeOpacity={0.7}
                >
                  <Card
                    title={String(titleValue || '')}
                    variant="default"
                    testID={`card-${item.id}`}
                  >
                    <Stack gap={theme.spacing.sm}>
                      {/* Image */}
                      {imageUrl && (
                        <View
                          style={{
                            width: '100%',
                            aspectRatio: 16 / 9,
                            borderRadius: theme.radius.surface,
                            overflow: 'hidden',
                            backgroundColor: theme.colors.muted,
                          }}
                        >
                          <Image
                            source={{ uri: imageUrl }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      )}

                      {/* Fields with labels */}
                      <Stack gap={theme.spacing.sm}>
                        {otherFields.slice(1, 4).map((fieldName) => {
                          const fieldConfig = entity.fields[fieldName];
                          if (!fieldConfig) return null;

                          return (
                            <View key={fieldName}>
                              <Text level="small" variant="muted">
                                {translateFieldLabel(fieldName, fieldConfig, t)}
                              </Text>
                              <Text>
                                {formatValue(item[fieldName], fieldConfig, t, {
                                  compact: true,
                                })}
                              </Text>
                            </View>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </Grid>
        )}
      </Section>
    </Stack>
  );
}

export default EntityCardList;
