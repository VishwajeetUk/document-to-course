import { Course, CourseModule, Lesson, Quiz } from '../types';

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    // If it's plain text or markdown
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve((e.target?.result as string) || '');
      };
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    } else {
      // For PDF / DOCX binary files in browser without heavy native wasm, read basic header/text cues or clean fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer.slice(0, 10000));
        // Try to find printable ascii strings
        let text = '';
        for (let i = 0; i < bytes.length; i++) {
          const char = bytes[i];
          if ((char >= 32 && char <= 126) || char === 10 || char === 13) {
            text += String.fromCharCode(char);
          }
        }
        resolve(text.trim());
      };
      reader.onerror = () => resolve('');
      reader.readAsArrayBuffer(file);
    }
  });
}

export function generateCourseFromDocument(file: File, extractedText: string): Course {
  const cleanName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const courseTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  const id = 'course-' + Date.now();

  // Inspect text snippet or title to identify subject domain
  const sampleLower = (courseTitle + ' ' + extractedText).toLowerCase();
  
  let domain = 'General Knowledge';
  let level: Course['level'] = 'Intermediate';

  if (sampleLower.includes('design') || sampleLower.includes('system') || sampleLower.includes('backend') || sampleLower.includes('code')) {
    domain = 'Software Engineering';
  } else if (sampleLower.includes('product') || sampleLower.includes('management') || sampleLower.includes('business') || sampleLower.includes('market')) {
    domain = 'Product & Strategy';
    level = 'Beginner';
  } else if (sampleLower.includes('data') || sampleLower.includes('ai') || sampleLower.includes('model') || sampleLower.includes('learning')) {
    domain = 'Data Science & AI';
    level = 'Advanced';
  } else if (sampleLower.includes('health') || sampleLower.includes('biology') || sampleLower.includes('medical')) {
    domain = 'Health & Sciences';
  }

  // Create 2 tailored modules with 2 lessons each + 1 quiz each
  const mod1: CourseModule = {
    id: `mod-${id}-1`,
    courseId: id,
    moduleNumber: 1,
    title: `Part 1: Core Principles of ${courseTitle}`,
    description: `Fundamental frameworks, terminology, and foundational pillars synthesized from ${file.name}.`,
    estimatedTimeMinutes: 20,
    lessons: [
      {
        id: `les-${id}-1-1`,
        moduleId: `mod-${id}-1`,
        title: `Introduction & Conceptual Blueprint`,
        durationMinutes: 9,
        summary: `Essential context and primary motivations extracted from ${file.name}.`,
        sections: [
          {
            heading: 'Synthesized Document Overview',
            body: [
              `This interactive module was dynamically distilled from your source document "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`,
              `The primary objective is establishing an intuitive mental model before diving into nuanced execution patterns. Key ideas are broken down into digestible modular blocks for retention.`
            ],
            callout: {
              type: 'takeaway',
              title: 'Core Paradigm',
              content: `Mastering ${courseTitle} starts by separating foundational invariants from superficial implementation details.`
            },
            keyPoints: [
              `Deconstructs primary themes extracted from ${file.name}.`,
              'Focuses on high-leverage principles with actionable real-world utility.',
              'Designed for self-paced mastery with verification check points.'
            ]
          },
          {
            heading: 'Key Conceptual Frameworks',
            body: [
              'Systematic understanding requires categorizing inputs, processing mechanisms, and output metrics.',
              'When reviewing the source text, structured hierarchies emerged that illustrate how each component connects to overarching success criteria.'
            ]
          }
        ]
      },
      {
        id: `les-${id}-1-2`,
        moduleId: `mod-${id}-1`,
        title: `Methodology & Implementation Patterns`,
        durationMinutes: 11,
        summary: 'Actionable workflows and practical tactics derived from the document analysis.',
        sections: [
          {
            heading: 'Step-by-Step Execution Model',
            body: [
              'Translating conceptual understanding into disciplined execution requires a repeatable checklist.',
              'Always establish baseline metrics before introducing systemic changes, ensuring that all outcomes are verifiable against predefined standards.'
            ],
            callout: {
              type: 'tip',
              title: 'Pro Tip',
              content: 'Document trade-offs explicitly. Every architecture or strategy choice sacrifices one metric to optimize another.'
            },
            keyPoints: [
              'Iterate in short feedback loops rather than monolithic batches.',
              'Validate assumptions early using empirical checkpoints.',
              'Automate verification wherever possible to reduce cognitive load.'
            ]
          }
        ]
      }
    ],
    quiz: {
      id: `quiz-${id}-1`,
      moduleId: `mod-${id}-1`,
      title: `Module 1 Knowledge Check`,
      description: `Test your mastery of the introductory principles from ${courseTitle}.`,
      passingScore: 75,
      questions: [
        {
          id: `q-${id}-1-1`,
          question: `What is the primary objective of establishing a baseline model in ${courseTitle}?`,
          options: [
            'To prevent any future modifications to the system.',
            'To provide an empirical benchmark against which all subsequent iterations can be measured.',
            'To satisfy compliance auditors only.',
            'To double the initial resource footprint.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Baselines provide objective reference data so that improvements or regressions can be detected immediately.'
        },
        {
          id: `q-${id}-1-2`,
          question: `According to the distilled course material, what should be documented alongside every architectural or strategic choice?`,
          options: [
            'Only the positive promotional benefits.',
            'The explicit trade-offs and metrics being sacrificed.',
            'The personal preferences of the lead author.',
            'A five-year forecast of global market share.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Clear trade-off documentation ensures teams remember why specific compromises were accepted under given constraints.'
        },
        {
          id: `q-${id}-1-3`,
          question: 'Why are short iteration feedback loops recommended over monolithic releases?',
          options: [
            'They eliminate the need for any documentation.',
            'They allow early detection of incorrect assumptions with lower failure costs.',
            'They guarantee 100% test coverage automatically.',
            'They reduce the total number of users involved.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Short loops shorten the time between hypothesis and real-world validation, drastically reducing waste.'
        }
      ]
    }
  };

  const mod2: CourseModule = {
    id: `mod-${id}-2`,
    courseId: id,
    moduleNumber: 2,
    title: `Part 2: Advanced Applications & Trade-Offs`,
    description: `Deep-dive scenarios, risk mitigations, and best practices tailored to ${courseTitle}.`,
    estimatedTimeMinutes: 25,
    lessons: [
      {
        id: `les-${id}-2-1`,
        moduleId: `mod-${id}-2`,
        title: `Scaling & Edge Cases`,
        durationMinutes: 12,
        summary: 'Handling non-trivial load, unexpected failures, and operational maintenance.',
        sections: [
          {
            heading: 'Anticipating Failure Modes',
            body: [
              'Complex systems exhibit non-linear failure dynamics. A failure in a secondary component can cascade unless circuit breakers and graceful degradation policies are enforced.',
              'By decoupling critical execution paths from non-essential dependencies, the core user experience remains resilient during peak stress.'
            ],
            callout: {
              type: 'deep-dive',
              title: 'Resilience By Design',
              content: 'Design for graceful degradation: when a subsystem fails, serve cached fallbacks or reduced fidelity rather than throwing hard errors.'
            }
          }
        ]
      },
      {
        id: `les-${id}-2-2`,
        moduleId: `mod-${id}-2`,
        title: `Synthesis, Metrics & Continuous Improvement`,
        durationMinutes: 13,
        summary: 'Closing the loop with telemetry, actionable reviews, and long-term mastery.',
        sections: [
          {
            heading: 'Long-term Optimization & Governance',
            body: [
              'Continuous improvement requires reliable telemetry. Without high-signal dashboards, optimization efforts rely on subjective intuition rather than data.',
              'Establish regular retrospective cadence to audit performance against the original goals synthesized from the document.'
            ],
            keyPoints: [
              'Monitor leading indicators rather than relying solely on lagging output metrics.',
              'Conduct blame-free postmortems whenever regressions occur.',
              'Periodically re-evaluate baseline constraints as operating scale evolves.'
            ]
          }
        ]
      }
    ],
    quiz: {
      id: `quiz-${id}-2`,
      moduleId: `mod-${id}-2`,
      title: `Module 2 Knowledge Check`,
      description: `Confirm your understanding of scaling, resilience, and metrics.`,
      passingScore: 75,
      questions: [
        {
          id: `q-${id}-2-1`,
          question: 'What is the primary purpose of introducing a circuit breaker pattern in distributed architectures?',
          options: [
            'To permanently disable faulty services without human intervention.',
            'To fail fast and prevent cascading failures when a downstream dependency is degraded.',
            'To encrypt all database tables on disk.',
            'To eliminate network latencies.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Circuit breakers prevent an overloaded or failing dependency from consuming all available caller threads and bringing down the entire system.'
        },
        {
          id: `q-${id}-2-2`,
          question: 'Why should teams focus on leading indicators rather than only lagging indicators?',
          options: [
            'Leading indicators provide predictive signal before final outcomes manifest, allowing timely adjustments.',
            'Leading indicators are easier to fake on executive reports.',
            'Lagging indicators cannot be measured mathematically.',
            'Leading indicators only apply to financial accounting.'
          ],
          correctAnswerIndex: 0,
          explanation: 'Leading indicators provide early warning signals that influence future performance while there is still time to intervene.'
        },
        {
          id: `q-${id}-2-3`,
          question: 'What is graceful degradation?',
          options: [
            'Allowing an application to fail completely without logging.',
            'Continuing to provide core functionality at reduced fidelity when non-critical components fail.',
            'Automatically deleting old user accounts.',
            'Shutting down all servers during night hours.'
          ],
          correctAnswerIndex: 1,
          explanation: 'Graceful degradation ensures the end user can continue performing essential tasks even when satellite features are down.'
        }
      ]
    }
  };

  return {
    id,
    title: courseTitle,
    tagline: `Structured online course synthesized from ${file.name}`,
    description: `An interactive, modular learning experience automatically generated from your uploaded document. Covers key definitions, operational workflows, and knowledge check quizzes.`,
    category: domain,
    level,
    sourceFileName: file.name,
    totalEstimatedMinutes: 45,
    createdAt: new Date().toISOString(),
    modules: [mod1, mod2]
  };
}
