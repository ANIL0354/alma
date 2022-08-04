import en from './langs/en.json';
import il from './langs/il.json';
import sa from './langs/sa.json';

export const getLang = (lang) => {
    if(lang == 'en')
        return en;

    if(lang == 'il')
        return il;

    if(lang == 'sa')
        return sa;    
}