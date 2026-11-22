# @donotdev/expo

## Unreleased

### Patch Changes

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
