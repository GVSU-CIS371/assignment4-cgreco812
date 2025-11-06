import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  onSnapshot,
  CollectionReference,
} from "firebase/firestore";

const baseColl: CollectionReference = collection(db, "bases");
const creamerColl: CollectionReference = collection(db, "creamers");
const syrupsColl: CollectionReference = collection(db, "syrups");
const beveragesColl = collection(db, "beverages");

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
  }),

  actions: {
    init() {
      getDocs(baseColl).then((qs:QuerySnapshot) =>{
        const results: BaseBeverageType[] = [];
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const data = qd.data();
          results.push({
            id: qd.id,
            name: data.name,
            color: data.color
          });
        });
        this.bases = results;
        this.currentBase = this.bases[0];
      })
      getDocs(creamerColl).then((qs:QuerySnapshot) =>{
        const results: CreamerType[] = [];
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const data = qd.data();
          results.push({
            id: qd.id,
            name: data.name,
            color: data.color
          });
        });
        this.creamers = results;
        this.currentCreamer = this.creamers[0];
      })
      getDocs(syrupsColl).then((qs:QuerySnapshot) =>{
        const results: SyrupType[] = [];
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const data = qd.data();
          results.push({
            id: qd.id,
            name: data.name,
            color: data.color
          });
        });
        this.syrups = results;
        this.currentSyrup = this.syrups[0];
      })    
      getDocs(beveragesColl).then((qs:QuerySnapshot) =>{
        const results: BeverageType[] = [];
        qs.forEach((qd: QueryDocumentSnapshot) => {
          const data = qd.data();
          results.push({
            id: qd.id,
            name: data.name,
            temp: data.temp,
            base: data.base,
            syrup: data.syrup,
            creamer: data.creamer,
          });
        });
        this.beverages = results;
      })     
    },
    makeBeverage() {
      const docRef = doc(beveragesColl);
      const newBeverage: BeverageType = {
        name: this.currentName,
        temp: this.currentTemp,
        base: this.currentBase!,
        creamer: this.currentCreamer!,
        syrup: this.currentSyrup!,
        id: docRef.id
      };

      this.beverages.push(newBeverage);
      setDoc(docRef, newBeverage);
      
      },

    showBeverage(recipe:BeverageType | null) {
      this.currentName = recipe!.name
      this.currentTemp = recipe!.temp;
      this.currentBase = recipe!.base;
      this.currentCreamer = recipe!.creamer;
      this.currentSyrup = recipe!.syrup;
    },
  },
});
