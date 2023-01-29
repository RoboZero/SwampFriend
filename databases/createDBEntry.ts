import UserIntro from "types/UserIntro";

class createDBEntry {
    public Q1: string;
    public Q2: string;
    public Q3: string[];
    public Q4: number | undefined;

    constructor(introPosts: UserIntro[]) {
        this.Q1 = introPosts[introPosts.length - 1].title;
        this.Q2 = introPosts[introPosts.length - 1].description;
        this.Q3 = introPosts[introPosts.length - 1].tags;
        this.Q4 = introPosts[introPosts.length - 1].color;
    }
}