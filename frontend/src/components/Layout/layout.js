import './layout.css'
import { Story } from '../Story/story.js'
import { Post } from '../Post/post.js'
import { Suggestion } from '../Suggestion/suggestion.js'

export function Layout() {
    return (
        <>
            <div className="MainGrid" >
                <div className="first-column" style={{gridArea: "firstColumn"}}>
                    <div className="box" >
                        <Story />
                    </div>
                    <div className="box" style={{margin: "30px 0"}} >
                        <Post />
                    </div>
                </div>
                <div style={{ gridArea: "secondColumn" }} >
                    <div className="suggestionBox" >
                        <Suggestion />
                    </div>
                </div>
            </div>
        </>
    )
}