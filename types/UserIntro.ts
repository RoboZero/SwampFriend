
/**
 * Interface for a UserIntro object,
 * an object describing one's introduction
 */
export default interface UserIntro {
  userId: string
  title: string,
  description: string,
  tags: string[]
  color?: number
}