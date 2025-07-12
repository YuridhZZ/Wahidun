import {create} from 'zustand'

const useAccountStore = create((set) =>({
    name:'',
    balance:0,
    accountNumber:'',
    accountType:'',

    
}) )