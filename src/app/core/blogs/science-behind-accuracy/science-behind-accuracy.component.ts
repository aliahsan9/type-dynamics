// science-behind-accuracy.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-science-behind-accuracy',
  imports:[CommonModule, RouterModule],
  templateUrl: './science-behind-accuracy.component.html',
  styleUrls: ['./science-behind-accuracy.component.scss']
})
export class ScienceBehindAccuracyComponent implements OnInit {

  blogTitle: string = "The Science Behind Typing Accuracy and Brain Performance";
  blogDate: string = "March 30, 2026";
  author: string = "TypeDynamics Research Team";

  sections: { title: string, content: string, image?: string }[] = [
    {
      title: "1. How Typing Affects Your Brain",
      content: "Typing is not just a motor skill; it engages multiple brain regions simultaneously. Studies show that typing activates the motor cortex, visual cortex, and areas responsible for memory and attention. The more accurate your typing, the more efficiently your brain processes information.",
      image: "assets/images/brain-typing.jpg"
    },
    {
      title: "2. The Role of Muscle Memory",
      content: "Typing accuracy heavily depends on muscle memory. Each finger learns the position of keys over time. This automaticity reduces cognitive load, allowing the brain to focus on content rather than keystrokes.",
      image: "assets/images/muscle-memory.jpg"
    },
    {
      title: "3. Hand-Eye Coordination",
      content: "Accurate typing requires synchronized hand-eye coordination. Your eyes guide your fingers to the correct keys, and repeated practice strengthens neural connections, making typing more precise and effortless.",
      image: "assets/images/hand-eye.jpg"
    },
    {
      title: "4. The Importance of Focus and Attention",
      content: "Typing accuracy improves when your brain is fully focused. Distractions reduce cognitive efficiency, causing more errors. Practicing mindfulness and reducing multitasking enhances typing performance.",
      image: "assets/images/focus.jpg"
    },
    {
      title: "5. Neuroplasticity and Typing",
      content: "Learning to type accurately strengthens neural pathways in the brain, a phenomenon known as neuroplasticity. This not only improves typing but also enhances overall cognitive functions like memory, problem-solving, and processing speed.",
      image: "assets/images/neuroplasticity.jpg"
    },
    {
      title: "6. The Feedback Loop of Accuracy",
      content: "Immediate feedback while typing—correcting mistakes—creates a positive feedback loop. The brain associates correct finger movements with outcomes, reinforcing accuracy over time.",
      image: "assets/images/feedback-loop.jpg"
    },
    {
      title: "7. Cognitive Benefits of Typing Accuracy",
      content: "Studies suggest that precise typing strengthens focus, mental agility, and decision-making. Skilled typists often demonstrate better working memory and faster problem-solving capabilities.",
      image: "assets/images/cognitive-benefits.jpg"
    },
    {
      title: "8. Combining Speed with Accuracy",
      content: "While speed is important, prioritizing accuracy builds a strong foundation. High-speed typing with frequent errors overloads the brain. Accurate typing first ensures that increased speed won’t compromise cognitive efficiency.",
      image: "assets/images/speed-accuracy.jpg"
    }
  ];

  constructor() { }

  ngOnInit(): void { }

}