# @donotdev/expo

## Unreleased

### Minor Changes

- DataTable: 25 rows per page by default (was 10), like the web DataTable. EntityList / EntityCardList titles read the new natural crud wording ("Filters", "{{count}} results"). The web admin-grid layout (sticky header, editable cells as text, bottom selection bar, empty row, stacked phone rows) is web only.
- DataTable sorts natively, with the web DataTable's sort (`sortTableRows`, copied from `@donotdev/components` into `src/utils/tableSort.ts`): `sortable` defaults to `true` (was `false`), every column with `dataIndex` or `render` sorts on header press on what its cells show, in the device language (case and accents ignored, numbers / dates / booleans and formatted numbers such as `1 234,50 €` by value, a reference or enum on its label, empty cells last); a column with nothing to sort over the data (all cells empty or the same, fewer than 2 rows) shows no arrow and its header press is inert. `sortable: false` on a column or `sortable={false}` on the table opt out. Was a `String` `<` / `>` on `row[key]`, and only on columns flagged `sortable: true` of a table flagged `sortable`. `EntityList` drops its now default `sortable: true` columns and sorts (its table never set `sortable`, so it did not).

### Patch Changes

- `Calendar` and `SubscriptionManager`: dates in the UI language and the app's time zone (`formatDate`, `i18n.timeZone`), as the web (owner decision 2026-11-25 T1); were `toLocaleDateString()` (the device's language and zone). The native picker reads and picks in the app's zone too (`timeZoneName={getAppTimeZone()}`).
- `EntityList`: a failed read shows an error state, not an empty table: the shared load error box (`CrudLoadError`, as the web, owner decision 2026-11-25 E1) in place of the table (testID `entity-list-error`): title `crud:errors.fetchFailed`, a translated reason from the error code (`loadErrorReasonKey`, `@donotdev/core`: `dndev:messages.*`) and a `dndev:routeError.tryAgain` retry. Said once: the results Section has no title then. Never the error's own message: it goes to the console. `EntityDisplayRenderer` shows the same box with a retry (`useCrudDoc` `refresh`); it showed "not found" and the raw error message under it.
- DataTable `TableColumn.sortValue?: (row) => unknown`: the row's sort value instead of the derived one, same rules (as the web DataTable); framework-internal. `EntityList` sets it on price columns (`effectivePrice`): a price sorts on the discounted price it shows, not on its formatted text.
- Atomic components typecheck in Expo apps. `mergeStyles` returns the style kind of its inputs (overloads: `ViewStyle`, `TextStyle`, `ImageStyle`); it returned `ViewStyle | TextStyle`, and under `expo/types` (every Expo app's `expo-env.d.ts`) `TextStyle` redeclares `cursor` as `string`, so it is not assignable to a View's `StyleProp<ViewStyle>` (44 errors). The package tsconfig hid it: its `types: ["node"]` never loaded `expo/types`.
- `initializeExpoAuth` typechecks in consumer apps: `firebase/auth` typings omit `getReactNativePersistence`, and the `firebase/auth.d.ts` augmentation was loaded only by the package's own `src/**` include; `authPersistence.ts` now references it.
- `type-check` also compiles `consumer-check/` with the scaffolded Expo app's settings (`expo/tsconfig.base`, strict, `expo-env.d.ts`), importing `@donotdev/expo` and `@donotdev/expo/features`. The package tsconfig adds `types: ["node", "expo/types"]` and `customConditions: ["react-native"]` (the consumer's resolution).

## 0.1.43

### Patch Changes

- Updated dependencies [20f9a0e]
- Updated dependencies [064cfbb]
- Updated dependencies [98d641c]
- Updated dependencies [a4c57d7]
  - @donotdev/crud@0.1.44
  - @donotdev/core@0.1.43
  - @donotdev/auth@0.1.43
  - @donotdev/billing@0.1.43
  - @donotdev/oauth@0.1.43
  - @donotdev/ui@0.1.43
