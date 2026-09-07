import { Course } from '../types';

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-system-design',
    title: 'Modern System Design at Scale',
    tagline: 'Architect resilient, scalable, and high-availability distributed systems from first principles.',
    description: 'A comprehensive curriculum covering client-server decomposition, horizontal scaling, caching hierarchies, database partitioning, and consensus models for high-throughput software.',
    category: 'Engineering & Architecture',
    level: 'Intermediate',
    sourceFileName: 'System_Design_Handbook_v4.pdf',
    totalEstimatedMinutes: 45,
    createdAt: '2025-01-15T09:00:00Z',
    modules: [
      {
        id: 'mod-sd-1',
        courseId: 'course-system-design',
        moduleNumber: 1,
        title: 'Core Foundations & Horizontal Scaling',
        description: 'Understand latency, throughput, single points of failure, and stateless horizontal scale patterns.',
        estimatedTimeMinutes: 15,
        lessons: [
          {
            id: 'les-sd-1-1',
            moduleId: 'mod-sd-1',
            title: 'Vertical vs. Horizontal Scaling & Load Balancing',
            durationMinutes: 7,
            summary: 'Learn the architectural tradeoffs between scale-up and scale-out, plus layer 4 vs layer 7 load distribution.',
            sections: [
              {
                heading: 'The Limits of Vertical Scaling',
                body: [
                  'Vertical scaling (scale-up) involves adding more compute, memory, and disk IOPS to a single instance. While operationally simple, it inevitably encounters physical hardware limits, exponentially increasing cost curves, and single-point-of-failure vulnerabilities during maintenance or outages.',
                  'Horizontal scaling (scale-out) separates the application logic into stateless replicas placed behind a load distribution layer. Instances can be provisioned or terminated dynamically based on workload volume.'
                ],
                callout: {
                  type: 'takeaway',
                  title: 'Stateless Invariant',
                  content: 'Always decouple user session storage into distributed stores (like Redis or DynamoDB). An HTTP request must be safely routable to any arbitrary backend replica.'
                },
                keyPoints: [
                  'Scale-up hit hard ceilings at motherboard socket and memory bus boundaries.',
                  'Scale-out requires stateless worker nodes and idempotent request processing.',
                  'Health checks should fail fast (e.g. 5-second interval) to trigger automated traffic rerouting.'
                ]
              },
              {
                heading: 'Load Balancing: Layer 4 vs. Layer 7',
                body: [
                  'Layer 4 (Transport) load balancers operate strictly on IP addresses and TCP/UDP port packets. They do not inspect packet payloads, yielding ultra-high throughput and microsecond latency routing.',
                  'Layer 7 (Application) load balancers inspect HTTP/HTTPS headers, cookies, and URI paths. This enables advanced routing features such as API path routing, TLS termination, and sticky cookie persistence at the cost of slight CPU overhead.'
                ],
                codeSnippet: {
                  language: 'nginx',
                  caption: 'Example Layer 7 Reverse Proxy upstream pool configuration',
                  code: `upstream api_cluster {
    least_conn; # Routes to instance with fewest active connections
    server app-worker-01.internal:8080 max_fails=3 fail_timeout=10s;
    server app-worker-02.internal:8080 max_fails=3 fail_timeout=10s;
    server app-worker-03.internal:8080 backup;
}`
                }
              }
            ]
          },
          {
            id: 'les-sd-1-2',
            moduleId: 'mod-sd-1',
            title: 'Caching Strategies & Eviction Policies',
            durationMinutes: 8,
            summary: 'Explore Write-Through, Write-Behind, Cache-Aside patterns, and memory eviction guarantees.',
            sections: [
              {
                heading: 'The Cache-Aside (Lazy Loading) Architecture',
                body: [
                  'In Cache-Aside, the application inspects the cache first. If a cache hit occurs, it returns immediately. If a cache miss occurs, the application queries the primary database, populates the cache with a Time-To-Live (TTL), and responds to the requester.',
                  'This pattern ensures that only actively requested keys consume valuable in-memory cache capacity, but introduces cache stampede risks when hot keys expire.'
                ],
                callout: {
                  type: 'tip',
                  title: 'Combating Cache Stampedes',
                  content: 'Use probabilistic early expiration (XFetch algorithm) or distributed mutex locks so only one worker rebuilds the cache while others read the stale value.'
                }
              },
              {
                heading: 'Eviction Policies: LRU vs. LFU',
                body: [
                  'When cache memory is saturated, an eviction algorithm must decide which keys to discard. Least Recently Used (LRU) discards items that have not been read recently, while Least Frequently Used (LFU) retains keys based on cumulative access count.',
                  'LRU is optimal for temporal locality workloads, while LFU shines when a stable core of popular catalog items persists over long windows.'
                ],
                keyPoints: [
                  'Cache-Aside requires setting sensible TTLs on every single write.',
                  'Write-Through guarantees cache/database parity but introduces write latency.',
                  'Never use in-memory caches as authoritative durable storage.'
                ]
              }
            ]
          }
        ],
        quiz: {
          id: 'quiz-sd-1',
          moduleId: 'mod-sd-1',
          title: 'Module 1 Check: Scaling & Caching',
          description: 'Validate your understanding of horizontal scaling tradeoffs, load balancer layers, and cache coherence.',
          passingScore: 75,
          questions: [
            {
              id: 'q-sd-1-1',
              question: 'Why is horizontal scaling generally preferred over vertical scaling for internet-scale platforms?',
              options: [
                'Horizontal scaling does not require network load balancers.',
                'Horizontal scaling avoids single points of failure and allows incremental, elastic capacity adjustments.',
                'Vertical scaling introduces higher network latency between database tables.',
                'Horizontal scaling eliminates the need to manage distributed session state.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Horizontal scaling provides elasticity and high fault tolerance by spreading compute across multiple independent machines behind load balancers.'
            },
            {
              id: 'q-sd-1-2',
              question: 'What is the primary difference between a Layer 4 and Layer 7 load balancer?',
              options: [
                'Layer 4 inspects HTTP headers; Layer 7 only inspects MAC addresses.',
                'Layer 4 works strictly with TCP/UDP packet headers, whereas Layer 7 inspects application layer data like URL paths and cookies.',
                'Layer 4 is software-only, while Layer 7 requires dedicated ASIC hardware.',
                'Layer 7 cannot perform SSL/TLS termination.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Layer 4 routes packets based on IP and port without reading payloads, while Layer 7 parses HTTP protocol details to make intelligent routing decisions.'
            },
            {
              id: 'q-sd-1-3',
              question: 'What is a primary characteristic of the Cache-Aside pattern?',
              options: [
                'The database directly updates the cache asynchronously on every SQL write.',
                'Every database write synchronously updates the cache before responding to the client.',
                'The application code queries the cache first, and on a miss, reads from the database and populates the cache.',
                'The cache automatically writes all mutations to disk once per hour.'
              ],
              correctAnswerIndex: 2,
              explanation: 'In Cache-Aside (lazy loading), the application orchestrates reads: check cache, if miss fetch from DB, then populate cache with a TTL.'
            },
            {
              id: 'q-sd-1-4',
              question: 'Which eviction algorithm is best suited for workloads where items accessed in the last few seconds are most likely to be requested again?',
              options: [
                'LFU (Least Frequently Used)',
                'FIFO (First-In, First-Out)',
                'LRU (Least Recently Used)',
                'Random Eviction'
              ],
              correctAnswerIndex: 2,
              explanation: 'LRU (Least Recently Used) prioritizes recency of access, perfectly matching temporal locality patterns.'
            }
          ]
        }
      },
      {
        id: 'mod-sd-2',
        courseId: 'course-system-design',
        moduleNumber: 2,
        title: 'Data Storage, Partitioning & CAP Theorem',
        description: 'Master relational vs. NoSQL tradeoffs, consistent hashing, database sharding, and replication models.',
        estimatedTimeMinutes: 30,
        lessons: [
          {
            id: 'les-sd-2-1',
            moduleId: 'mod-sd-2',
            title: 'Database Sharding & Consistent Hashing',
            durationMinutes: 10,
            summary: 'Techniques for distributing large datasets across isolated database partitions without hot-spotting.',
            sections: [
              {
                heading: 'Why Partition Data?',
                body: [
                  'As write traffic and table sizes cross single-node disk capacities (typically tens of terabytes or thousands of writes per second), data must be partitioned (sharded).',
                  'Range-based sharding partitions data by key intervals (e.g. A-D, E-H). While simple for range queries, it frequently suffers from severe write hotspots when timestamps or sequential IDs are used.'
                ],
                callout: {
                  type: 'warning',
                  title: 'Re-sharding Hazard',
                  content: 'Naïve modulo hashing (hash(key) % N) causes N-1 keys to move whenever the cluster adds or removes a node. Use consistent hashing instead!'
                }
              },
              {
                heading: 'Consistent Hashing Rings',
                body: [
                  'Consistent hashing maps both servers and data keys onto a circular 360-degree hash ring. When a new node is added, only k/N keys need to be migrated, where k is total keys and N is total servers.',
                  'To avoid uneven key distributions, modern engines assign dozens of "virtual nodes" (vnodes) to each physical machine across the ring.'
                ],
                codeSnippet: {
                  language: 'typescript',
                  caption: 'Simplified conceptual token ring lookup in consistent hashing',
                  code: `function findNodeForKey(key: string, ring: Map<number, string>): string {
  const hash = sha256(key);
  // Find the smallest token in ring >= hash, or wrap around to the first token
  const token = findFirstGreaterThanOrEqualTo(ring.keys(), hash) ?? ring.keys()[0];
  return ring.get(token)!;
}`
                }
              }
            ]
          },
          {
            id: 'les-sd-2-2',
            moduleId: 'mod-sd-2',
            title: 'CAP Theorem & Eventual Consistency',
            durationMinutes: 10,
            summary: 'Balancing Consistency, Availability, and Partition Tolerance in distributed state machines.',
            sections: [
              {
                heading: 'The Inevitability of Network Partitions',
                body: [
                  'The CAP theorem proves that in any asynchronous distributed network, an application can only guarantee two out of three: Consistency, Availability, and Partition Tolerance.',
                  'Because physical network partitions (cables cut, switch failures, cross-region timeouts) are inevitable in real-world infrastructure, system designers must choose between CP (Consistency over Availability) or AP (Availability over Consistency) during a partition.'
                ],
                callout: {
                  type: 'deep-dive',
                  title: 'PACELC Theorem',
                  content: 'PACELC extends CAP: If there is a Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).'
                },
                keyPoints: [
                  'CP Systems (e.g. Spanner, ZooKeeper, Raft) reject writes or block if quorum cannot be proven.',
                  'AP Systems (e.g. Cassandra, DynamoDB with eventual consistency) accept writes locally and reconcile later via vector clocks or last-write-wins.',
                  'Financial transaction ledgers generally mandate CP, while social media feed timelines prioritize AP.'
                ]
              }
            ]
          }
        ],
        quiz: {
          id: 'quiz-sd-2',
          moduleId: 'mod-sd-2',
          title: 'Module 2 Check: Storage & Consistency',
          description: 'Assess your comprehension of consistent hashing, replication quorum, and the CAP theorem.',
          passingScore: 75,
          questions: [
            {
              id: 'q-sd-2-1',
              question: 'What is the primary benefit of consistent hashing with virtual nodes?',
              options: [
                'It guarantees ACID transactions across all partitions.',
                'It minimizes key migrations during cluster node additions and evenly balances load across physical servers.',
                'It encrypts all network payloads traversing the cluster.',
                'It eliminates the need for replication.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Consistent hashing only moves a fraction of keys when servers change, and virtual nodes prevent uneven cluster clustering.'
            },
            {
              id: 'q-sd-2-2',
              question: 'According to the CAP Theorem, why can a distributed system not be simultaneously CA (Consistent and Available) in practice?',
              options: [
                'CPUs cannot compute hashes fast enough.',
                'Network partitions are inevitable in physical distributed networks, forcing a choice between rejecting requests or serving stale data.',
                'CA requires relational databases which cannot run on multiple machines.',
                'Operating systems enforce single-thread mutex locks on network interfaces.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Because network partitions (P) cannot be avoided in real networks, every real distributed system must pick between C or A during a split.'
            },
            {
              id: 'q-sd-2-3',
              question: 'Which of the following systems is traditionally designed as an AP (Available under Partition) architecture?',
              options: [
                'Apache Cassandra with eventual consistency read settings',
                'Google Cloud Spanner using TrueTime consensus',
                'Etcd cluster maintaining a single Raft leader',
                'PostgreSQL primary node accepting serializable writes'
              ],
              correctAnswerIndex: 0,
              explanation: 'Cassandra was built ground-up for high write availability (AP), replicating writes asynchronously and resolving conflicts later.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-product-management',
    title: 'Product Management from Zero to One',
    tagline: 'Transform customer ambiguity into high-impact product roadmaps, validated PRDs, and metric-driven execution.',
    description: 'Master continuous customer discovery, hypothesis-driven product requirements documents (PRDs), prioritization matrix frameworks, and North Star metric architectures.',
    category: 'Product & Leadership',
    level: 'Beginner',
    sourceFileName: 'PM_Playbook_Silicon_Valley_2025.docx',
    totalEstimatedMinutes: 35,
    createdAt: '2025-02-10T14:30:00Z',
    modules: [
      {
        id: 'mod-pm-1',
        courseId: 'course-product-management',
        moduleNumber: 1,
        title: 'Customer Discovery & Opportunity Sizing',
        description: 'Learn non-leading interview techniques and market opportunity framing.',
        estimatedTimeMinutes: 15,
        lessons: [
          {
            id: 'les-pm-1-1',
            moduleId: 'mod-pm-1',
            title: 'The Mom Test: Conducting Unbiased User Interviews',
            durationMinutes: 8,
            summary: 'How to ask questions that elicit honest past behavioral data rather than hypothetical flattery.',
            sections: [
              {
                heading: 'The Core Rule of User Research',
                body: [
                  'People want to be polite. If you ask someone "Would you pay for an app that organizes your bookmarks automatically?", they will almost universally say "Yes!". But when the product launches, zero credit cards are swiped.',
                  'Rob Fitzpatrick’s "The Mom Test" establishes that you must never ask people if your idea is good. Instead, ask about specific things they did in the past, how much time/money it cost them, and what workarounds they currently employ.'
                ],
                callout: {
                  type: 'takeaway',
                  title: 'Golden Interview Principle',
                  content: 'Talk about their life, not your idea. Ask about specifics in the past, not opinions about the future.'
                },
                keyPoints: [
                  'Bad question: "Would you like a feature that summarizes meetings?"',
                  'Good question: "Tell me about the last time you missed an action item from a meeting. What happened?"',
                  'If the user hasn’t already actively searched for a workaround, the problem is not severe enough.'
                ]
              }
            ]
          },
          {
            id: 'les-pm-1-2',
            moduleId: 'mod-pm-1',
            title: 'TAM, SAM, SOM & Opportunity Solution Trees',
            durationMinutes: 7,
            summary: 'Calculate realistic addressable market boundaries and connect customer pains directly to product bets.',
            sections: [
              {
                heading: 'Deconstructing Addressable Market Tiers',
                body: [
                  'Total Addressable Market (TAM) represents the entire annual revenue opportunity if you reached 100% market share of every potential customer.',
                  'Serviceable Addressable Market (SAM) is the subset of TAM targeted by your current product form factor and geographic reach.',
                  'Serviceable Obtainable Market (SOM) is the realistic market share you can capture in the next 12 to 24 months given your current sales and marketing horsepower.'
                ],
                callout: {
                  type: 'tip',
                  title: 'Bottom-Up Estimation Over Top-Down Reports',
                  content: 'Investors and executive stakeholders discount top-down Gartner claims ("The cloud market is $500B"). Calculate bottom-up: (Number of target businesses) × (Annual contract value).'
                }
              }
            ]
          }
        ],
        quiz: {
          id: 'quiz-pm-1',
          moduleId: 'mod-pm-1',
          title: 'Module 1 Check: Discovery & Sizing',
          description: 'Test your understanding of user interviewing practices and market analysis.',
          passingScore: 75,
          questions: [
            {
              id: 'q-pm-1-1',
              question: 'According to "The Mom Test", which of the following is the most effective user interview question?',
              options: [
                '"Would you pay $20/month for a faster invoice tracker?"',
                '"Do you think our proposed dashboard design looks clean?"',
                '"How did you handle your client invoices last week, and what tools did you use?"',
                '"If we build an AI spreadsheet importer, will you be our beta tester?"'
              ],
              correctAnswerIndex: 2,
              explanation: 'Asking about specific past behaviors reveals actual pain points and workflows without soliciting polite, unreliable hypotheticals.'
            },
            {
              id: 'q-pm-1-2',
              question: 'What does SOM represent in market sizing?',
              options: [
                'System Operating Model for software releases.',
                'The portion of the market your team can realistically capture over the short term (1-2 years).',
                'The theoretical total market if everyone on Earth adopted your product.',
                'The total sales expenditure required to acquire customer zero.'
              ],
              correctAnswerIndex: 1,
              explanation: 'SOM (Serviceable Obtainable Market) is your near-term realistic target given existing sales, distribution, and product readiness.'
            },
            {
              id: 'q-pm-1-3',
              question: 'What is a strong behavioral signal that a customer has a genuine, hair-on-fire problem?',
              options: [
                'They say they love the startup’s mission on social media.',
                'They have already cobbled together an ugly workaround or spent budget trying to fix it.',
                'They attend the startup’s promotional webinar.',
                'They agree that software should generally be more automated.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Existing makeshift workarounds prove that the pain is intolerable enough that the user took action before your product existed.'
            }
          ]
        }
      },
      {
        id: 'mod-pm-2',
        courseId: 'course-product-management',
        moduleNumber: 2,
        title: 'PRDs, Prioritization & Metrics',
        description: 'Write crisp PRDs, apply the RICE framework, and align teams around a North Star metric.',
        estimatedTimeMinutes: 20,
        lessons: [
          {
            id: 'les-pm-2-1',
            moduleId: 'mod-pm-2',
            title: 'Anatomy of a High-Impact PRD',
            durationMinutes: 10,
            summary: 'Structure problem statements, non-goals, user stories, and acceptance criteria without dictating engineering implementation.',
            sections: [
              {
                heading: 'Why Most PRDs Fail',
                body: [
                  'A common mistake among junior PMs is writing 30-page documents describing button colors and exact database schemas. Engineering teams either ignore them or resent the micromanagement.',
                  'A great Product Requirements Document clearly frames: Problem statement, Target customer persona, Non-goals (what we are deliberately NOT building), Success metrics, and functional acceptance criteria.'
                ],
                callout: {
                  type: 'deep-dive',
                  title: 'The Power of Explicit Non-Goals',
                  content: 'Defining non-goals prevents scope creep during sprint cycles. When stakeholders ask "Can we also support offline sync?", you can point directly to the agreed-upon non-goals.'
                }
              }
            ]
          },
          {
            id: 'les-pm-2-2',
            moduleId: 'mod-pm-2',
            title: 'RICE Prioritization & North Star Metric',
            durationMinutes: 10,
            summary: 'Score backlog opportunities quantitatively using Reach, Impact, Confidence, and Effort.',
            sections: [
              {
                heading: 'Calculating RICE Scores',
                body: [
                  'The RICE formula provides a standardized mathematical model to evaluate competing feature ideas across diverse stakeholders:',
                  'Score = (Reach × Impact × Confidence) ÷ Effort',
                  'Confidence is expressed as a percentage (e.g., 100% = high research backing, 50% = wild guess). It penalizes pet projects that lack validation.'
                ],
                keyPoints: [
                  'Reach: Estimated number of people impacted per time window (e.g. 5,000 users/month).',
                  'Impact: 3 (massive), 2 (high), 1 (medium), 0.5 (low), 0.25 (minimal).',
                  'Effort: Estimated in person-months or sprint story points.',
                  'The North Star metric captures the primary value delivered to customers (e.g. Spotify: Minutes listened).'
                ]
              }
            ]
          }
        ],
        quiz: {
          id: 'quiz-pm-2',
          moduleId: 'mod-pm-2',
          title: 'Module 2 Check: Prioritization & PRDs',
          description: 'Verify your ability to write clear requirements and rank backlogs using RICE.',
          passingScore: 75,
          questions: [
            {
              id: 'q-pm-2-1',
              question: 'In a Product Requirements Document (PRD), what is the primary purpose of the "Non-Goals" section?',
              options: [
                'To list performance evaluations for underperforming team members.',
                'To explicitly define what the team will NOT build in this iteration to prevent scope creep.',
                'To list competitive products that failed in the market.',
                'To specify database foreign key constraints.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Non-goals create explicit boundaries, allowing the team to reject tangential feature requests without reopening debate.'
            },
            {
              id: 'q-pm-2-2',
              question: 'In the RICE scoring formula (Reach × Impact × Confidence ÷ Effort), what happens to a feature score if Confidence is low (e.g., 20%)?',
              options: [
                'The score increases because of potential upside.',
                'The score decreases sharply, punishing speculative ideas that lack customer validation.',
                'The Effort metric is automatically doubled.',
                'The formula returns zero.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Confidence acts as a dampener to prevent high-effort, speculative features from dominating the roadmap without empirical evidence.'
            },
            {
              id: 'q-pm-2-3',
              question: 'Which metric serves as an authentic "North Star" for an e-commerce marketplace?',
              options: [
                'Total registered user accounts since inception',
                'Number of app downloads on iOS',
                'Monthly Gross Merchandise Value (GMV) of completed orders',
                'Daily visits to the blog section'
              ],
              correctAnswerIndex: 2,
              explanation: 'GMV reflects real transactional value delivered to both buyers finding goods and merchants making sales.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-machine-learning',
    title: 'Applied Machine Learning & Neural Networks',
    tagline: 'Understand the mathematical foundations and deployment workflows behind modern AI models.',
    description: 'Explore supervised learning, gradient descent loss functions, convolutional and transformer architectures, and bias-variance tradeoff diagnostics.',
    category: 'Data Science & AI',
    level: 'Advanced',
    sourceFileName: 'Machine_Learning_Compendium.pdf',
    totalEstimatedMinutes: 50,
    createdAt: '2025-03-01T11:00:00Z',
    modules: [
      {
        id: 'mod-ml-1',
        courseId: 'course-machine-learning',
        moduleNumber: 1,
        title: 'Supervised Learning & Optimization',
        description: 'Loss landscapes, gradient descent mechanics, and regularization strategies.',
        estimatedTimeMinutes: 25,
        lessons: [
          {
            id: 'les-ml-1-1',
            moduleId: 'mod-ml-1',
            title: 'Gradient Descent & Loss Functions',
            durationMinutes: 12,
            summary: 'How neural networks minimize objective loss functions using partial derivatives and backpropagation.',
            sections: [
              {
                heading: 'Navigating the High-Dimensional Loss Landscape',
                body: [
                  'Training a machine learning model is an optimization problem: we seek weight parameters θ that minimize an empirical loss function L(θ) over training samples.',
                  'In Mean Squared Error (MSE) regression or Cross-Entropy classification, we compute the gradient ∇L with respect to each weight, adjusting parameters in the opposite direction of the steepest ascent.'
                ],
                callout: {
                  type: 'deep-dive',
                  title: 'Learning Rate Schedules',
                  content: 'A learning rate that is too high causes divergence, while one that is too low leads to agonizingly slow convergence or saddle-point entrapment. Use Adam or cosine annealing schedules.'
                },
                codeSnippet: {
                  language: 'python',
                  caption: 'Core update rule in stochastic gradient descent with momentum',
                  code: `v = beta * v + (1 - beta) * grad_W
W = W - learning_rate * v`
                }
              }
            ]
          },
          {
            id: 'les-ml-1-2',
            moduleId: 'mod-ml-1',
            title: 'Overfitting, Regularization & Cross-Validation',
            durationMinutes: 13,
            summary: 'Techniques for diagnosing high variance vs. high bias and applying L1/L2 penalties.',
            sections: [
              {
                heading: 'The Bias-Variance Tradeoff',
                body: [
                  'High bias (underfitting) occurs when the model is too simple to capture the underlying relationships in the dataset, leading to poor training and test accuracy.',
                  'High variance (overfitting) occurs when the model memorizes idiosyncratic training noise, achieving near-zero training error but terrible generalization on unseen validation splits.'
                ],
                keyPoints: [
                  'L2 Regularization (Ridge / Weight Decay) shrinks weights smoothly toward zero.',
                  'L1 Regularization (Lasso) induces sparsity, setting uninformative feature weights strictly to zero.',
                  'Dropout randomly zeroes out activations during training to prevent co-adaptation of neurons.'
                ]
              }
            ]
          }
        ],
        quiz: {
          id: 'quiz-ml-1',
          moduleId: 'mod-ml-1',
          title: 'Module 1 Check: ML Optimization',
          description: 'Assess understanding of loss functions, gradient descent, and regularization.',
          passingScore: 75,
          questions: [
            {
              id: 'q-ml-1-1',
              question: 'What is the primary consequence of setting a learning rate too high during gradient descent?',
              options: [
                'The model always converges in exactly one epoch.',
                'The optimization path can oscillate wildly and diverge, causing the loss to explode toward infinity or NaN.',
                'Weights are forced to become strictly zero.',
                'The dataset automatically downsamples itself.'
              ],
              correctAnswerIndex: 1,
              explanation: 'Excessive step sizes overshoot the minima, bouncing up the loss surface and causing divergence.'
            },
            {
              id: 'q-ml-1-2',
              question: 'If a deep neural network achieves 99.8% accuracy on the training set but only 64.2% accuracy on the validation set, what problem is it experiencing?',
              options: [
                'High bias (underfitting)',
                'High variance (overfitting)',
                'Label leakage in the test set',
                'GPU memory fragmentation'
              ],
              correctAnswerIndex: 1,
              explanation: 'A huge delta between high training accuracy and low validation accuracy is the textbook signature of overfitting (high variance).'
            },
            {
              id: 'q-ml-1-3',
              question: 'How does L1 regularization (Lasso) differ fundamentally from L2 regularization (Ridge)?',
              options: [
                'L1 regularization drives some weights exactly to zero, producing sparse feature selection.',
                'L1 only works on decision trees, while L2 is for neural nets.',
                'L2 eliminates the need for training epochs.',
                'L1 can only be calculated with positive numbers.'
              ],
              correctAnswerIndex: 0,
              explanation: 'The diamond constraint of the L1 norm drives non-essential weights strictly to zero, yielding sparse interpretable models.'
            }
          ]
        }
      }
    ]
  }
];
