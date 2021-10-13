import { createTypedHooks } from "easy-peasy";

export default function useViewStore<StoreModel extends object>() {
  const typedHooks = createTypedHooks<StoreModel>();

  return {
    state: typedHooks.useStoreState((state) => state),
    action: typedHooks.useStoreActions((action) => action)
    // dispatch: typedHooks.useStoreDispatch
  }
};
