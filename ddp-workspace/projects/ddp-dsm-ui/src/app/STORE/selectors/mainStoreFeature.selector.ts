import {createFeatureSelector} from "@ngrx/store";
import {StoreStateModel} from "../store.reducer";

export const MainStoreFeatureSelector = createFeatureSelector<StoreStateModel>('MainStore');
