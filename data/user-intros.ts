import UserIntro from "../types/UserIntro";

export let userIntros: UserIntro[] = [];

export function setUserIntros(v: UserIntro[]){
  userIntros = v;
}