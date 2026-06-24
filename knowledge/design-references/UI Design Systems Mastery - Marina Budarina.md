# UI Design Systems Mastery - Marina Budarina

_Quelle: bild-/scan-basiertes PDF, Text via OCR (Tesseract, eng) extrahiert._

---

## Seite 1

UI Design
systems Mastery

Advance in your career
and become an efficient designer.

Marina Budarina

---

## Seite 2

Table of contents

Version 2.0. Last Update: Jan 30, 2023.

Introduction
My vision
My design journey

What to expect

Part 1 - Introduction to Design Systems

History
What is a Design System
Definition
Parts of the system
Examples
Do you need a design system?
Benefits
Challenges
Signs that you need a Design System
What to consider?
Terms confusions
“Component” vs “Pattern” library

“UI kit” vs “Design system”

8

08

11
16

19
27
28
30
40
43
44
4S
46
47
50
51
31

---

## Seite 3

Part 2 - Preparation & setting of the base
Important notes
Audit
What is a design audit?
From where to start?
The ways you can do the audit
How to organize and categorize?
Audit checklist
Understanding problems and needs
Setting goals and framing the system
Design system team
How big should the team be?
Team roles
Team types
From where to start
Design system principles and rules
How to define principles?

Suggestions

Part 3 - Foundations
Tokens
What are design tokens?

When should you and shouldn't use tokens?

56
37
58
59
59
60
60
65
67
69
72
73
73
795
76
79
80
81

85
86
87
90

---

## Seite 4

Tokens’ benefits

Token types

Naming conventions

Theming: what and how

Do's and don'ts

Tokens implementation
Colors

Glossary of terms

Keeping branding in mind

Color psychology

Creating a base color palette

Creating tints and shades

Naming conventions

Creating color styles

Limiting Tint & Shade Quantity

Accessibility

Tokens

Light and dark themes using tokens
Typography

Choosing a typeface

Best typefaces

Size units

Building a type scale

TABLE OF CONTENTS

91

93

SI)

97

SS)
101
103
104
105
106
109
113
119
121
123
126
131
135
142
143
148
150
156

04

---

## Seite 5

Line height 153)

Naming conventions 161
Building a typography system 162
Creating Figma text styles 166
Building a PRO typography system [XW 169
Documentation §Xaw 176
Spacing 180
Glossary of terms 181
Defining a spacing system 183
Naming conventions 186
Spacing Tokens 188
Spacing usage 189
Figma tips 191
Grids and layouts 194
Glossary of terms 195
Breakpoints 197
Grid types 199
Layout types 201
Creating grids 204
Complex layout grids 213
Grid Tokens 218

TABLE OF CONTENTS 05

---

## Seite 6

Part 04 - Components, patterns, templates

What to consider before creating any component 222
Not so atomic approach. There is a hierarchy. 223
Naming conventions 227
Scalability 228
Connecting Tokens 229
Documentation 230

Components 232
Core and compound components 233
Component categories 234
From where to start 236
Creating components. Button. Method 1 237
Creating components. Button. Method 2 242
Testing components 247

Patterns & templates 254
What is a UI design pattern? Jays)
Common UI design patterns & how to apply them JIS)
How to create UI design patterns SS)
Where to find existing Ul design pattern libraries 260
Dark design patterns 261
Templates 262
How to create templates 263

Pages 264

---

## Seite 7

Part 05 - Documentation

Documentation
Why do we need documentation?
Documentation types and tools

Structure & what should be inside

Part 06 - Implementation & scaling
Adopt, Adapt or Create

Adopt. What it is about and how to do it

Adapt. What it is about and how to do it

Create. What it is about and how to do it

Which approach to choose?
Tips for freelancers

Freelance vs full-time

How can design systems help freelance designers?

How to use design systems to improve your efficiency?

Outro - Final words

What's next?

Copyright © 2023 Marina Budarina. All rights reserved.

268

269
270
270
274

286

287
288
290
292
296
301
302
303
304

308

309

No portion of this e-book may be reproduced in any form without

permission from the publisher (Marina Budarina).

---

## Seite 8

Introduction

Hey there,
lam Marina Budarina - a digital product designer and creator of
this e-book. First and foremost, thank you for trusting me and

purchasing my content to be a part of this learning journey.

oS

That's me!
Great to see you!

And here is my
Instagram

4

Before we dig into the theory and practice, | want to tell you a little

@marina_uiux

about my journey, the obstacles | have met, and my vision - to

encourage you and give light on why | wrote this e-book.

My vision

First, |am from a small city in Kazakhstan.
Second, | am a software engineer - that is my initial degree.

Third, |am a self-taught designer.

| began my self-taught journey by gathering information from

---

## Seite 9

different sources, applying them in the form of practical solutions,
and eventually spending hours and hours figuring things out on my

own. It was not easy, but | got through it.

To make it less complicated and easier to navigate this field for
many beginners and professionals alike, | conceptualized and
brought this e-book to life. It aims to gather all the ideas and
concepts that have profoundly helped me and that you can use in

your design journey.
All your experience matters, and all of it will help you.

| have done many different things in the past, some just as a
hobby, some | took very seriously. But all of it made me who lam.

And if you think you are a zero at something - you may be wrong.

c> gp,

- = - Eo

2 =

Initially, | needed to gain experience in the design itself. Still, | did

photography, knew Photoshop, had an eye on aesthetics, was

---

## Seite 10

creative, had communication skills, understood programming,

learned psychology, etc.

You do know something, and you do have skills. Let them be your

strengths.

If you do something - be committed. Otherwise - quit.

If you are 100% sure that something will not be helpful or you do not
want to do that, just quit. Because even if it is applicable, you have
already decided, in your head, that it is not - you framed yourself.
For example: only go to a lecture or a masterclass if you are going
to pay attention, if you are going to commit, and if you haven't

come just for the sake of being there.

During my university program, | was one of the best students. But
you know what? | skipped classes that | did not find helpful or those
that were giving low value to me. | did that not because | was lazy: |
worked a lot, earned money, and learned things on my own. But in
a better, more efficient way. | valued my time and effort and did

not want to waste it.

As a result, | could do more, and | did it well. Teachers loved me,

and | was happy.

INTRODUCTION 10

---

## Seite 11

My design journey

At the beginning of 4th year, in parallel with my university program,

| got into design.

How it started: my friend asked me for “help” - to create designs
for Instagram posts. After that, | began to explore design more, just
for fun. | designed some websites and even posted some of my

works on Instagram - initially, it was just a hobby.

Next, the same person asked me to design a taxi app. | have not
been paid. However, that was a significant step, after which |
gained some confidence and started to get some projects from

Instagram.

After a while, | got into one of my first big projects - a start-up
(SunnyPeople). We were creating a product for brands and

influencers to run their business on Web3.

How did | land this job?
What helped me? Design skills - maybe, communication - mindset

- perhaps. But it was all together, all my previous experiences, that

made me who lam. That is what let me in.

But to use actual data and not rely just on my assumptions, | have

asked the manager, and here is what he said:

INTRODUCTION iH

---

## Seite 12

“1. Ability to understand the product and customer and put

yourself in the customer's shoes.

2. Proposing structure and steps rather than jumping straight into

Ul and drawing.

3. Resourcefulness: You never design based on your knowledge,
   but you are resourceful and always see what other apps and

products do and consider that.

4. Not afraid to push back and provide your opinion based on your
   intuition and experience. Junior people typically accept everything
   managers say and never offer their opinion. Managers (or any
   human!) can be wrong many times. You used to tell me. You
   disagreed and preferred another method/approach (of course, in

a respectful way).

5. Coachable: You are very coachable, take feedback, adapt,

improve, etc.

6. Kind: Last but not least, you were a nice and kind person who
   was pleasant to work with. We had fun, we joked, and you were a
   good team member. That is very important for me, too, and teams

in general as well.”
So it was not so much about actual skills but all my knowledge,
values, and experience that allowed me to think and act ina

specific way.

INTRODUCTION 12

---

## Seite 13

So here my idea or vision takes place:

No matter what you do, the more diverse your knowledge

and experience are, the better.

That allows you to see problems from different perspectives,

provide better results and grow faster.

This is why knowledge about design systems will be helpful
not only to designers but to developers, managers, owners,

etc.

So let’s keep going with the experience.

Most of the time, when you work freelance and in start-ups - you
are the only designer in a team. That was the case. So I've started
to work from 0, doing research, analysis, IA, wireframes, and

eventually Ul.

And here we get closer to the design system...

There are problems that you may not face in small projects or
when you are a junior designing only several screens, but trust me,
when a product is big and grows, the wrong approach and flawed
system can create a lot of trouble.

Simple example: when there are a lot of the same screens, and if
your team at some point decides to change one color, change a

component, or add some tiny element - it will take you hours of

---

## Seite 14

tedious work to change it on all 100+ screens. Or if you did not
agree at the beginning on how the pop-up should work or what
happens on bigger screens - it will require extra time,

communication, and energy, which you may not have at this point.

If there is some complicated labeling system in the design, you
may explain it once, but in a month, everyone will forget, you will
have to repeat it, or even worse - you will forget. And if you will

leave the project - this information will stay only in your head...

Do you see?

Instead of being a designer that creates a good product,

you become a pixel mover.

There was a lot of work, and my time was limited. So from my side, |

did everything to simplify the process.

| have created color and typography styles. | was turning elements
into components as | was designing UI. | did that back then only to
enhance and speed up my workflow and keep things consistent

while just reusing parts | have created smartly.

INTRODUCTION 14

---

## Seite 15

And | knew if | needed to change something - | would not have to
go through each screen repeatedly. | will change it in one place -

and done. Easy and quick.

So as | was simplifying my design processes, documentation came
into place. And here is a big thanks to one of the best managers |
have worked with, who became for me a very good friend: Rami
Assaf. He was very involved in the process and forced me to
document some rules on confluence (we used Jira (Atlassian) for
our product management). So | started to put some notes in Figma

as well for each case.

This way, | didn’t have to soend much time explaining my
reasoning and components usage rule over and over again. | also
did not keep redundant information in my head, reducing mental

overload.

Bit by bit, We were creating a design system. But, of course, it was
not complete or perfect. And as you see, | did not know much
about design systems back then, and it was an outcome, a need,
that made the whole process easier, organized, and helped the

entire team.

A design system was a need, and as a result, that made the
whole process easier and organized and helped the entire

team.

INTRODUCTION 15

---

## Seite 16

What to expect?

In this e-book, | will tell you about: what a design system is, why you
need or do not need it, what purposes they serve, from which
components it consists, how to build your design system most

efficiently, and how to use it.

You will understand how to collaborate with the team,
communicate with clients about the design system's needs, and

explain its value.

And as a result, you will be able to build design systems from

scratch or make a reusable design system for your future projects.

You will be able to improve your skills and knowledge, increase
your efficiency, work faster, create better products and provide
better results, get a promotion or a better job, impress your clients

with professionalism, and go to another level of your career.

You will learn how designs and prototypes are meant to be
translated into code, speed up the development process, and
reduce misunderstandings during the handoff.

If you are a non-designer, you will get a solid foundation and will be
able to break into UI/UX, product design, or even managing

processes.

INTRODUCTION 16

---

## Seite 17

Key takeaways

- No matter where you're coming from and what are your
  current conditions, nowadays you can learn from any
  country, become a good specialist and change your life.
  But it will require some diligence, hard work, and

discipline.

- All your experience matters, and all of it will help you. The
  more you know - the better. Diverse knowledge is a key
  to a broad outlook on life and problems, which will help

you to become a great specialist.

- Knowledge about design systems will be helpful not only

to designers but to developers, managers, owners, etc.

- If you dont create a good foundation and suitable
  processes for the design work, you can quickly become
  a pixel mover; instead of being a designer that focuses

on logic, structure, UX, and UI.

- For me, a design system was a NEED that made the
  whole work process more manageable and organized

and helped the entire team.

---

## Seite 18

Introduction to
Design Systems.

---

## Seite 19

CHAPTER 1

History

History is important - it reminds us that we are not working in the
dark. Some people came before us, and we are not building

anything from 0.

As Sir lsaac Newton, the famous English scientist, once said:

“If | have seen further, it is by standing on the shoulders of giants.”

It means that his ideas did not come from him alone. He relied on

the views of those who came before him. So do all of us.
Let's look at some milestones in the history of design systems and

see what each can teach us about the best ways to build and

implement these frameworks into our digital design processes.

HISTORY

---

## Seite 20

Main Milestones

First, let’s consider the system itself.

Knowledge systematization was the primary impulse for evolution
and had profound historical roots, consider even books and
libraries. The better we became at systematizing our knowledge,

the further we stepped into the future.

Next, let’s consider digital interfaces.
If we are talking about User Interface design systems (here we
cover digital interfaces specifically), they probably started to

evolve in the 1960s - when the first PC was invented.

But all of that is part of the past, and it does not look like something
we will discuss in this e-book. So we will skip it and cover the main

milestones starting from the pattern libraries.

2010 2013 2015
Dynamic Market Atomic design Zeroheight
@ @ @ e @ td @
1999 2011 2014
Pattern Libraries Bootstrap Google Material

Note: If you want to dive deeper into history, | will leave you a very

nice resource. Find it at the end of the chapter.

| don’t like visuals of this chapter, but that’s the history ;)

---

## Seite 21

The mid-2000’s - Pattern libraries.

Before we got to use design systems, designers used pattern
libraries to make their work more consistent and repeatable.
Pattern libraries were collections of reusable design elements. The
library defined how those elements behave, what they look like,
and how they are coded. They were more about form than function

but served as a starting point for a consistent design.

Browse categories

» GETTING INPUT
» NAVIGATION
» DEALING WITH DATA

Pattern categories

Getting input Navigation

Getting the user to input data. = The user needs to locate

is task that should be tailored specific features and content

to the context of use. and needs navigation to
accomplish this.

Social Miscellaneous

Allow the user to associate, Patterns that haven't found

communicate, and interact their main category yet.

with other people online.

Dealing with data
Data can be searched,
formatted, overviewed, and
browsed in a variety of ways.

» MISCELLANEOUS

Recent blog posts

We say yes to those
we know and like

Written by toxboe on Nov 2

We prefer to say yes to the
requests of someone we know
and like. This fact is used on a
daily basis by web designers to
make us comply with their
sales pitches. We “like” things
on facebook, recommend
friends and contacts on
LinkedIn, and associate
ourselves with successful
products from Apple in order to

Recently added patterns

Event calendar
CONTENT BNElale

Pricing table
SiO paie; Oct 25

Product page

SirlOpaine; Oct 26

The user need to know details
about a product in order to make
a purchase decision or satisfy a

The user needs to get an
overview of what pricing plans
are offered and how they differ

The user wants to find events of
interest happening in a certain
period of time. Read more

appeal to similar others.
Continue reading

Image source: The Wayback Machine

2010 - new dynamic IT market.

In the 2010s, IT is emerging in a sense we understand nowadays.
That was a dynamic, evolving market that needed new,
appropriate tools and systems that would allow us to create and
iterate in the same fast and dynamic way. Desktop-based
software and websites gave way to a flood of mobile apps and

cross-platform, responsive Uls.

HISTORY 21

---

## Seite 22

2011 - Bootstrap.

In 2011, Twitter launched an open-source front-end framework

used for developing component-based websites and layouts. It

was called Bootstrap.

Bootstrap

Overview

Bootstrap, from Twitter

Bootstrap is a toolkit from Twitter designed to kickstart development of webapps and sites.
It includes base CSS and HTML for typography, forms, buttons, tables, grids, navigation, and more.

Nerd alert: Bootstrap is built with Less and was designed to work out of the gate with modern browsers in mind.

HOTLINK THE CSS

For the quickest and easiest start, just copy this
snippet into your webpage.

<link rel="stylesheet" href="http:/Atwitter. github cq

About Bootstrap si»:

History

Engineers at Twitter have historically used almost
any library they were familiar with to meet front-end
requirements. Bootstrap began as an answer to the
challenges that presented. With the help of many
awesome folks, Bootstrap has grown significantly.

Read more on dev.twitter.com >

USE IT WITH LESS
A fan of using Less? No problem, just clone the

repo and add these lines:

<link rel="stylesheet/less” href="/path/to/bootstra

<script src="/pathito/less js"></script> 4

Browser support

Bootstrap is tested and supported in major modern
browsers like Chrome, Safari, Internet Explorer, and
Firefox.

©eee8CcoO

FORK ON GITHUB

Download, fork, pull, file issues, and more with
the official Bootstrap repo on Github.

Bootstrap on GitHub »

Currently v1.3.0

What's included

Bootstrap comes complete with compiled CSS,
uncompiled, and example templates.

. Javascript plugins

- All original -less files

« Fully compiled and minified CSS

- Complete styleguide documentation

Image source: Web Design Museum, Bootstrap, from Twitter website in 2011.

It became widely adopted but was not complete and more of a

“pattern library” than a “design system.”

This framework for sure automated and fastened development

processes, now we could build and test our ideas faster.

But, it had a standard set of grids, selectors, and other elements, so

it restricted creativity. You would have to go the extra mile to create

something unique or different design-wise.

HISTORY

22

---

## Seite 23

So we needed something that would cover the needs of both
design and development communities—the more extensive
requirements of web applications and the unique needs of the

individual projects.

We needed something that would cover the needs of both

design and development communities.

2013 - Atomic design.

In response to these needs and market changes Atomic Design
framework appears, formalized by designer Brad Frost. He broke
websites up into their smallest possible patterns, known as atoms.
These atoms could then be assembled and reconfigured at
different levels into more complex components and templates in a

website’s design.

Atoms Molecules Organisms Patterns Pages

We came to modular and repeatable from just a set of

repeatable components.

---

## Seite 24

And it was not just a set of systemized design elements. That was

an ideology.

This approach did not restrict creativity, though it still simplified
some decision-making processes so that we could put more time

into more significant problems.

Later, many of these trends converged into a concept known as
design systems. Finally, the implementation of design systems has

been formalized into a set of tools, techniques, and ideologies.

2014 - Google’s Material Design.
One of the first design systems significantly impacted was Google's
Material Design. They combined the best practices from early

pattern libraries and Brad Frost’s Atomic Design framework.

Since Google had a lot of products with massive reach and scale,
they needed a system of commonly used elements, along with
guidelines on how to use them, to keep consistency across all
devices, platforms, and screen sizes. But having just a library of
repeatable elements was not enough. The real power lay in using
guidelines and principles, which was the next big step in design

systems’ history.

HISTORY 24

---

## Seite 25

rl olngie-Hne ler rn

ACTION1 ACT
eo Single-line item eee

oe Enabled @

HeV

Page title << Q :}
‘I i filled
Snackbar with action Unfille
ee Max

: ‘ Conversion Sales

- | | Lorem ipsum dolor sit amet,

itle here

Nowadays, full-scale design systems are part of any significant
product that helps improve the user experience while making life

easier for designers and engineers.

The theory and practice of design systems continue with new tools

and approaches. And as it does, it changes.

And considering Newton's quote:

We should improve what we already have to match the

ever-evolving world and technologies.

HISTORY 25

---

## Seite 26

bf

Key takeaways

- History is essential, and we should use all knowledge of

the past to create a better future.

- Knowledge systematization was the primary impulse for

evolution.

- The rapidly growing digital environment pushed the

evolution toward modern design systems.

- Main historical milestones: Pattern libraries, Bootstrap,

Atomic Design, Google's Material design.

---

## Seite 27

Whatisa
design system

product. Yet, people dont talk about it anymore because it has

become an industry standard. With this chapter, | want to give you

Q

an overall understanding of design system.

Table of contents

- Definition
  « Parts of the system

- Examples of design systems

---

## Seite 28

Definition

There are so many, many, many definitions of design systems on

the internet.

Simply put: design system is a collection of reusable components

that can be used to build web applications and websites.

More comprehensive: design system is a set of visual styles,
reusable elements, and components implemented in a code and
spread in design tools, along with rules and standards, that guide
how to use them to build user interfaces more efficiently and

cohesively.

Fcompmons ete

Vsuatstvies 2° ultnes

And here | want you to understand one significant point. The design

system is an outcome.

A design system is a tool and process humans use to make

life easier.

---

## Seite 29

I'm saying that because there is a tendency to sell and buy things

only for their “sake.”

What do! mean by that?

| can go and buy a soup spoon, put it on the wall and never use it,
keeping it for decorative purposes. And that’s okay in this case. But
it will become a problem if | convince someone to put their budget
and spend their time to go and buy a soup spoon if | convince
them that it’s what they need to become well-fed. So even though
it’s a very nice tool, it should be used wisely if we want to achieve

some results.

The design system doesn’t make any sense outside of the product
itself. (By product, | mean app, platform, or any other digital
interface). We design systems FOR the products. And not just to
have all this fancy stuff. So please don’t make a design system for
the sake of the design system itself. Don’t make it a point of sale if

there is no need. Provide value.

WHAT IS A DESIGN SYSTEM 29

---

## Seite 30

Parts of the system

When | started exploring this a while ago, | got so confused with

naming, structure... So if you feel the same - it’s okay;)

If you check other companies, you might see that structure and
elements of their design systems can vary.

Style guides can be part of “foundations.” Branding can be
separate and include other pillars, or they can use completely

different terms for this.

But no matter how companies gather and structure all these
pillars, most will have some high-level vision/philosophy, style
guide, components library, pattern library, guidelines/principles/

rules on how to use them, and all of that will be documented.

Philosophy Style guide Components, Patterns

a aD a= —
: Aa = se
abcdefgkl
123456789 Ga»

+Guidelines +Guidelines

Documentation

---

## Seite 31

But | want to give you a comprehensive picture first. This big picture
can be, and, most of the time, it should be simplified. So don’t think
that you have to create everything below. As I've said - design
systems should help. So this comes down to preference and needs,

which varies quite a bit.

Purpose, mission, vision, values

Before going into material details, we should take a big picture. Any
product exists for a reason and serves some purpose. And we need

to understand what is the mission/purpose/goals of it.

me

t\_
wi Ul Ee

Without a vision With a vision

58s .

In the beginning, we should ask ourselves questions that include
why (purpose), how (mission), and what (vision) we want to

achieve. And then we can come to more specific aims - goals.

Having a clear set of shared goals helps focus on priorities, take the

right actions, and align the whole team in one direction.

---

## Seite 32

We can also have brand/product/team values - these ideals will
guide our choices.

But if your project is small, having clear goals might be enough.

All the above can be and, in the best scenario, should be stated
and documented. Usually, the business itself or the owner should
define these things. But if it's a start-up and there is no set purpose,
you, as a high-level designer, can have a call, ask questions,

brainstorm and help define those goals.

Design principles

We need guidance to achieve business/product goals using our
primary tool - design. And here, design principles come into place.
They are going to make decisions more meaningful and

consistent.

Example: Google material design principles.

1. Material is the metaphor.

Material Design is inspired by the physical world and its textures,
including how they reflect light and cast shadows. Material

surfaces reimagine the mediums of paper and ink. 2. Bold, graphic, and intentional.

Material Design is guided by print design methods — typography,

grids, space, scale, color, and imagery — to create hierarchy,

WHAT IS A DESIGN SYSTEM 32

---

## Seite 33

meaning, and focus that immerse viewers in the experience.

Light

Shade

Brand identity, AK style guide

Before coming to a style guide, | want to clarify the brand identity.
Brand identity is a broader concept than just a style guide. Your
customers and audience think of identity when they hear your
company’s name or see your logo. It’s both the voice and the tone
within all content you create, and it can be experienced through

any work you produce.

WHAT IS A DESIGN SYSTEM 33

---

## Seite 34

Image source: dribbble.

We can split brand identity into three main parts.

Core Brand Identity

- Fundamentals (mission, vision, purpose, values)
- Positioning (compared to competitors)

- Target audience(s)

Verbal identity / Content style guide
Content style guide controls how the copy and text within the
design are developed and can consist of the following:

- Brand persona/personality

- Tone of voice

- Slogan/tagline

¢ Value proposition

---

## Seite 35

Visual identity / Visual style guide
Style guides are primarily aimed at designers and show how all
content should be designed and can consist of:

- Logo usage

- Color palette

- Typography

- Imagery guidelines (photography, illustration, video,

iconography, etc.)

- Grids & layout

Duolingo can be an excellent example with a solid brand identity.

Zw duolingo

Image source: design.duolingo.com

Style guide

Branding is a big thing. And usually, there is a separate person in
the company for this sort of work. That’s why here | want to narrow
something down and introduce you to a style guide more

straightforwardly - which will be enough for you to build a system.

WHAT IS A DESIGN SYSTEM 35

---

## Seite 36

Grids

7

A

Style guide focuses on graphic styles and their usage and can

consist of:

Color

Typography

Spacing

Layout

Grids

Shapes (define the style of container corners, offering a range of
roundedness from square to fully circular)
Elevation

Effects (shadow, blur)

Icons

illustrations

Photographies

Animations/Motion

---

## Seite 37

¢ Voice and tone

¢ Sounds

Component library

Components are our building blocks. And the component library is

a set of these reusable elements that designers and developers

can use to learn about these components and implement specific

Ul elements.

Inputs

Input empty

Input active
| |

Input filled

diana@fintory.com

Input error state

diana.com ~ @

E-Mail address format inva

Password clear

q Hello12345|

Inactive input autopopulation loading state

Organization ID 3)

Inactive input

#RemX-0001

Image source: dribbble.

Searchable dropdown loading state

| Fin)

5

Financials
Fintech

Fintory &

Dropdown default
User rol
Dropdown selected

Banking Administrator

Input stepper

Number of inflows

Radio button input

Sell in bulk only

Radio button input selected

© sell in buik only

CTAs

Default

Primary CTA
Secondary CTA Create new user Create
Tertiary CTA Cancel Cancel
Text Link Back Back,

UI Elements

Toggle © leons

e @
Checkbox PI O ce
Radiobutton ° 4 a

In addition to visual examples of components, the library should

include:

WHAT IS A DESIGN SYSTEM

37

---

## Seite 38

- Component name: a specific and unique Ul component name
  to avoid miscommunication between designers and developers

- Description: a clear explanation for what this element is and
  how it is typically used, occasionally accompanied by do’s and
  don'ts for context and clarification

* Attributes: variables or adjustments that can be made to
  customize or adapt the component for specific needs (i.e., color,
  size, shape, copy)

- State: recommended defaults and the subsequent changes in
  appearance

- Code snippets: the actual code excerpt for the element

* Front-end & backend frameworks to implement the library (if

applicable) to avoid painful and unnecessary debugging

Pattern library

Patterns are some rules by which the interface behaves. Same as a
rule, they are a set of components and answer the question:
"How do we do X ?”. That can be notifications, loadings, validation,

or empty states
They allow us to use our components logically and consistently

across all the products. They typically feature content structures,

layouts, and/or templates.

WHAT IS A DESIGN SYSTEM 38

---

## Seite 39

Empty state pattern ne e

When: occurs when an item’s
content can’t be shown.

Display rules: the most basic empty
state displays a non-interactive
image and a text tagline
Nothing to see here yet

Avoiding completely empty states:
there are several situations in which
you can provide users with
alternatives to truly empty states...

Documentation

Documentation a way to keep everything mentioned above
structured and saved somewhere with clear instructions and

guidelines, so that the whole team can use it properly.

I'm anew member,
need a guidance

&

I'm a developer,
| contribute

Not sure how to use
specific component

I'm a designer, | will add
a new component here

---

## Seite 40

Examples

If you explore Apple, Google, Uber, Aironb, and other systems
documentation, you will see that they may use different terms for

specific parts of the system.

Atlassian Design system

For example, the Atlassian Design system is split into:

Brand - it includes Mission, Personality, Promise, and Values.
Foundations (AK style guide, but more comprehensive) -
Accessibility, color, tokens, elevation, grid, iconography, illustrations,
logos, typography.

Content - content, Inclusive language, language and grammar,

vocabulary, tone of voice principles, writing guidelines, writing style.

Some companies under branding consider everything | mentioned
above (including foundations and content). While components,
patterns, and resources are the typical sections of most design

systems.

I

-

A ATLASSIAN

Design System

LJ)
|

Image source: atlassian.design

---

## Seite 41

Carbon design system

The carbon design system gathered the style guide under the

“guidelines” umbrella. So again: the structure and section naming

depends on the needs. There are no rigid restrictions.

Guidelines can be part of the style guide and be inside each

component page or on a separate page on our documentation

website. The style guide can go under the branding umbrella or be

a separate section.

Also, the design system can have several repositories for different

types of users — for example, design and development.

Carbon Design System

Image source: carbondesignsystem.com

ee 5
— x —_—_— x
=x —x —x °—
—_— xX —_—\_— xX

---

## Seite 42

Key takeaways

e

A design system can take different forms. What should
be inside depends on your product/business, customer

needs, platforms, marketing channels, etc.

In a simplified view, a design system can be split into

three main parts: style guide, components, and patterns.

In a more comprehensive view, the design system
consists of philosophy and goals; guidelines, rules and
principles; color, typography, spacing, grid systems;
components; patterns; documentation; and code

snippets.

If you want to inspire, check the design systems of

famous companies, but don’t copy. Think of your needs.

---

## Seite 43

Do you need a design
system?

So many tech giants have and flaunt design systems: Salesforce’s

Lightning, IBM’s Carbon, Google’s Material... So you've probably
wondered if building one for your organization is worthwhile.

Let's explore the pros and cons of building and maintaining the

Q

system and some other factors you should consider.

Table of contents

- Benefits
- Challenges
- Signs that you need a Design System

e What to consider?

---

## Seite 44

Benefits

Design systems have significant benefits and can help you, even at

an early stage.

Save time and money for design, dev, and product teams.

With functional component and pattern libraries, your team can
take UI assets and code snippets and run with them, knowing they
will work. So it is much easier and faster to design the final Ul. You

don't have to move every pixel yourself.

Reduce interpretation problems.

When | design something and don’t communicate it clearly to
devs, this will lead to misunderstanding and inconsistency, leading
to technical debt. Design systems eliminate this problem with good

documentation, examples, and guidelines.

Create a single source of truth for devs and designers.
If you update the style guide or some component, your design
system does too, and applying those sweeping changes to your

products becomes much easier, faster, and safer.

Create consistency across different platforms.
It helps with overall consistency as well as consistency across
different platforms. Tokens will help us with that. No 500 shades of

grey anymore. Less design debt.

---

## Seite 45

Challenges

Regardless of the numerous problems design systems solve, they

for sure have some cons:

Creating and maintaining a design system is a high-effort and
time-intensive activity.

Design systems, unfortunately, are not just a one-and-done
solution. At their best, they are constantly evolving as teams gather

feedback from those who use them.

It takes time to teach others how to use the design system.

For a design system to be successful, it must be used and
supported by all, and everyone must know when and how to use
and modify it. In addition, teams should feel comfortable using and
changing (if needed) patterns and components. This requires
training, constant communication, and helping your teams take

ownership of the design system.

---

## Seite 46

Signs that you need
a design system

Your palette has 50 shades of gray, or you dont have a palette
at all.

The design is flooded with many variations of fonts,
inconsistent sizing and spacing systems, etc.

You have several versions of the same element that are not
significantly different.

Developers complain that it is “expensive” and time-
consuming for them to create some simple design elements.
You struggle each time, deciding which spacing to choose and
doing it "by eye.”

You need help determining if an element's version is outdated or
new.

You regularly have arguments within the team on which UI
elements to use in the specific case.

You spend a lot of time on the interface's design (rather than the

logic) part.

---

## Seite 47

What to consider ?

The main factors to consider when creating a design system are
the scale and replicability of your projects, as well as the resources

and time available.

Design systems can become unwieldy collections of components
and code when poorly implemented and maintained. But when
done properly, they can educate team members, streamline work,

and enable designers to tackle complex UX problems.

You don't need a complex, full-set system if you are a small early-
stage start-up. A good style guide and a tangible set of
components can be a solid foundation for future scaling. If you
understand the big picture, you can start taking small steps,

simplifying your work, and staying efficient and professional.

DO YOU NEED A DESIGN SYSTEM? 47

---

## Seite 48

Key takeaways

- Design systems have lots of benefits.

- It saves time and budget in the long term, reduces
  interpretation problems and technical debt, and
  eliminates inconsistencies by creating one source of
  truth.

° Initially, it may require much effort and time, which your

early-stage company may not be able to allocate yet.

- In the early stages, you dont need a complex system.
  Rome wasnt built in a day. Take it step by step, keeping

in mind the resources available.

- Whether you will have a full-scale design system or not, a
  solid style guide and consistent components usage is a

must.

---

## Seite 49

Homework

- Create a Figma design file. You will save all your

conclusions and work there.

- Justify why you/the team need the system.

Imagine that you have a 5 min call with your manager/
team and want to assure them to implement a design
system in the company. For that, you need to have
powerful arguments in your arsenal that will help you

convince the leader.

Write down 3-5 critical arguments in your Figma file.

---

## Seite 50

Terms confusions

| see, same as you probably, that quite often, there are some

differentiations in what specific term means. So let’s consider some

Q

of them and clear it up a little bit.

Table of contents

- “Component” vs “Pattern” library

- “UI kit” vs “Design system”

---

## Seite 51

“Component” vs “Pattern” library

In some topics, a pattern library is considered a collection of all
reusable elements in your product, like carousels, buttons, drop-
downs, and other components. And that is what most systems call

a “Components library.”

So what is the difference?

Component libraries specify individual Ul elements, while pattern
libraries feature content structures, layouts, and/or templates. Like
the components, the patterns are meant to be reused and

adapted.

Pattern library describes everyday user actions, tasks, and
experiences. For example, you have a “pattern” of waking up every
day and going to brush your teeth. In the same way, design
systems have “behavior” patterns. An example could be: loading,

entering information, accessing private data, and modality.

“UI kit” vs “Design system”

Have you ever downloaded a UI kit & felt confused? Was that a UI

kit, or was that a Design system?
If we google these two things, we get approximately the same file

from the set of components that includes buttons, inputs, drop-

downs, etc.

TERMS CONFUSIONS 5]

---

## Seite 52

So what is the real difference between these two concepts? Is it the

same?! Well... No.

Let’s break it down.

What design elements/assets do you use for your daily work?

It's probably some Accordions, Tabs, Buttons, Checkboxes, Toggles,
and Inputs. That's a UI kit - assets we use to build the user interface.

\*From an atomic perspective, they are molecules.

But what do you need to create these elements? Let’s say a button.
We need at least two things: color & font - atoms.
\*From an atomic perspective, they are “atoms” and are part of the

style guide.

50905e \_ All molecules are

r Molecule | part of the UI kit

All atoms are part
mem Atoms |

of the Style guide --...- -"

Then we may create a form from buttons and inputs. From atomic
perspective it’s an organisms. Another example of organisms: is
product cards in an online store, a filter block, a header, and a

footer.

TERMS CONFUSIONS 52

---

## Seite 53

product cards in an online store, a filter block, a header, and a

footer.

We use UI kit to build

Login form .
organisms and pages

budorinoe@gmail.com

seeeeeee | é Molecule

Molecule Login

What if | have a big team and want them to use all these
components and patterns correctly?
Then we need some philosophy for using them, design principles,

guidelines, best practices, etc.

This whole thing is a Design System

Values Philosophy Vision

Style guide Atoms

UI kit is set of

Molecules
components

Components

Complex elements Organisms

Guidelines Design principles Best ptactices

---

## Seite 54

So here we have a scheme that consists of elements that are

needed to create a product - it’s a design system.

All these elements do not exist separately from each other. Instead,

each block depends on the previous one.

Question: Can a UI kit exist outside of the design system?

As we said earlier, you must have a minimum color and font to
create a button. And if we have colors and fonts, and it’s
implemented into code, then this is already a design system, a
simple one that does not include patterns or guidelines (internal

and external).

Answer: UI kit can exist by itself only when you consider it in a

vacuum.

Output: The design system and UI kit are entirely different levels of

hierarchy.
Ul kit is a set of simple elements, and the design system is a set of

all the necessary entities to create a digital product. It serves to

unify and optimize the development process.

TERMS CONFUSIONS 54

---

## Seite 55

bf

Key takeaways

- Componentlibrary specify individual Ul elements.

- Pattern library feature content structures, layouts, and/

or templates.
¢ ULkit is a set of simple elements.

- Design system is a set of all necessary entities to create

a digital product.

=

- Explore existing design systems in open sources - here

is a link; just click.

Homework

- Think, is ita design system or a UI-Kit? Justify your

conclusions.

- Take a look at pattern libraries and compare them with

component libraries. Write down the difference.

---

## Seite 56

Preparation &
setting of the base

---

## Seite 57

Important notes

We can’t start from nowhere. So first, we need to understand the

Current situation, product, and processes.

We should explore the business culture, politics, products, tools,
and workflows; define problems and needs; review and analyze
current approach for design at the company to understand better

what kind of design system is needed.

? Note 1: It’s easier to remove

A design system can vary, and in this e-book format, | can’t
consider all edge cases. So here I’m describing the general
process. | think it will benefit everyone - even if you don’t need to
make all steps, even if you don’t have a product yet or a big team -
it’s good to know what the process would look like at a bigger
scale. Because it’s easier to remove and simplify than add
something you don’t even know about. In the last chapter, |’ll

propose a simplified process if you're a freelancer working alone.

? Note 2: Design system is a product

Work on a design system can be considered as work on any other
product - as you will see, it’s going to include even similar steps
(research, for example), and as for any product, we should have a

structure, plan and implement it iteratively.

IMPORTANT NOTES 57

---

## Seite 58

Audit

In design, saying something is a problem isn't enough. You need to
show the issues and provide a solution. Audit aims to get an
overview of where the design could be more consistent and

efficient. This step is required if there is a product already.
An audit will also be our first step whenever we start working on a
particular part of the system or whenever we want to add a new

component or change an existing one.

Why so? Because we must clearly understand what this means for

the entire system and how it will globally affect the interface.

\*In the following chapters, we will dive deeper into each element

Q

audit, so don’t worry. I've got you covered.

Table of contents

- What is a design audit?

¢ From where to start?

- The ways you can do the audit

¢ How to organize and categorize?
¢ Audit checklist

---

## Seite 59

What is a design audit?

A design audit reviews all visual design elements used by a

brand or a company.

The procedure does not require formalization, and you can do it in
any way that is more comfortable for you. For example, even an
audit “on the knee’ will bring tangible benefits, but make sure you
document the audit results, because you will need to return to

them later.

From where to start?

First, you need to decide what you're auditing. For example, are you
auditing specific components, such as buttons or inputs? Or

maybe something more complex, like information architecture?

Note! We will do a complete design audit at this stage, so we need
to gather everything: every single design material the company

has created.

So start big: go from more significant assets to smaller ones.
Example:
Flows -> Pages -> Sections/ Patterns -> Component types ->

Specific component -> style guide pillars (color, typography, etc.).

---

## Seite 60

The ways you can do the audit

Screenshots - for static information.
Tool: “Awesome screenshot and screen recorder” plugin for taking

screenshots of the whole page.

Screen recording - for dynamic information, user flows, processes

or animations. Tool: Loom.

How to organize and categorize?

As you go, you will have a set of screenshots. The most important
here is to organize everything very neatly. You can organize
everything into folders, pages, tables, or any other comfortable

format.

How you will do that - depends on the specific project since that

can be a single website or a set of products and apps.

Way 1 - folder per product.

You can put your screenshots into various folders, categorized by
products or channels. For example, you can have folders for the
website, marketing ads, social media posts, products that the

client is selling, etc. Each folder can have subfolders.

---

## Seite 61

Marketing Web lOS Banners
Website Application Application for Ads

Home Our About Customer Weare
page Services Company support Hiring

Way 2 - file per product, page per part.
You can use Figma and have a file (instead of a folder) per
product. In each file, you can have “pages” for specific parts of your

product/app/website and for components and style guide
elements.

---

## Seite 62

Figma ] figma file - 1 product Grouped elements
pages on the page

Page...

Tip: split Ul elements into groups.
Set some logic and put Ul elements into corresponding groups. In
Figma, you can create a frame/page per group, depending on

your project size.

Here is the grouping example:

Global - Ul elements that are shared across the entire product.
(Headers, Footers, etc.)

Images - Logos, heroes, avatars, thumbnails backgrounds, etc

Icons - Magnifying Glasses, Social Icons, Arrows, Hamburgers,

Spinners, Favicons, etc.)

---

## Seite 63

Buttons - any unique button patterns throughout the experience.

(Primary, Secondary, Big, Small, Disabled, Active, Loading, etc.)

Forms - any forms that require user input. (Inputs, Text Areas,

Select Menus, Checkboxes, Switches, Radio Buttons, Sliders, etc.)

Way 3 - Trello board.
| liked the method described by Ruiwen Tay.

The tool used - is Trello.

Search Results - Map ~~ J] Search Results - List o> |] Listing Detail Page

Tene F checkbox J Text iets { Dropdown
[icons J rckicon J [arrowcon J tcons J Tctcon ]

Search / filter bar - Residential Search /filter bar - Residential

Image source: Medium.

Each list (top to bottom) represents a page on the website: Home,
Listing detail, Customer, etc. Within each list, different sections of a
page are captured as screenshots and organized into cards. Each
card is tagged with labels (panel on the right) representing each

component present within the section of the page.

The labels are color-coded based on the type of component.

AUDIT 63

---

## Seite 64

Example: checkboxes, radio buttons, etc., are forms of data input,

hence they are color-coded green.

C7]

‘Type to search by term, label, member, or due
time,

BB ects
asteca is

1. enh chart

a Info / success / warning / error message

Image source: Medium.

This type of organization allows us to filter by a component or
search for a specific element, section, and page; therefore, we can

easily spot all inconsistencies.

AUDIT 64

---

## Seite 65

Audit checklist

Here is the basic example of the design audit checklist:

Solid color pallet with limited amount of tints and shades
Typography is the same throughout the product

All the icons are of identical style and clearly convey their

meaning

Interactive components are of convenient and consistent

size and easily clickable

Accessibility: the contrast between text and background is

good, etc...
Search bars have the same pattern.

Ect...

Audit can have different forms, keep that in mind.

Ul audit UX audit Copywriting

---

## Seite 66

wt

- Audit is needed for the correct implementation of design

Key takeaways

system elements. It allows you to create solutions

tailored to the actual conditions of the product.

- The procedure does not require any formalization, and
  you can do it in any way that is more comfortable for

you.

=

Homework

- Conduct an audit and identify issues. Analyze:
  Problems and inconsistencies in the interface;
  Problems in design, communication and management
  processes;

Technical and development difficulties.

Feel free to network or brainstorm with your colleagues to

identify their current pains and needs.

- Document the results in Figma.

---

## Seite 67

Understanding
problems and needs

Before creating a system, we should understand current and
possible future problems and needs. As you do the audit, you may

already face some of them.

Problems and needs definitions will help us with the next step -
setting clear reasons why we even need a design system because

we don’t want to create solutions for problems we don't have.

---

## Seite 68

Steps you should take

List down: the products, features, and services that you already
have or planning to have, which platforms and tools your team

uses, and which processes and workflows you follow.

Inspect and audit all surfaces including Blog Posts, Facebook Ads,
email templates, etc. (there might be a lot of surfaces attached to
your design system, not just web app or ios app, that can be

Facebook ads, Instagram ads, etc.)

Question different teams’ current problems and needs: designers,
developers, and stakeholders. List and structure all the information

they provided.

? Note: In our case, users here are people who use the design
system. If your design system is just for your inner product - then
it's developers, designers, and managers. The users list gets

extended if it’s for external teams (Shopify is an example).

Possible problems:
@ Inconsistent design
@ You need to put more time into redundant work

@ Your team spends a lot of time clearing structure or tech depth.

---

## Seite 69

Setting goals and
framing the system.

After you understood the product and business a little bit more,
made an audit, and defined the main problems and needs, it's
time to set clear reasoning why you even need a design system,
why it’s important, and set design system goals. It will help to

create a clear direction.

Brainstorming session

Set up a call or conduct a brainstorming session with the team
(you can also bring the CEO and key stakeholders) and answer the

questions below.

? Note: If you are the one who is taking responsibility and initiative
for building this system, try to document your answers to these

questions before the call- that’s going to be more professional.

Question: Why do we need a design system? Which problems
does it solve?
Possible answers: It will reduce the inconsistency that the product

currently has. The team will spend less time on redundant tasks.

Question: What is the goal of our design system? Which results do

we want to achieve by creating it?

---

## Seite 70

Possible answers: Free up more time so the team can focus more

on user problems.

Question: Why is it important? What is going to happen if we won't
start creating it?

Possible answers 1: Our product will be beaten by our competitors
if we dont innovate it.

Possible answers 2: Users can be confused by the inconsistencies

in our designs.

Question: How will it help us?
Possible answers: It will save us time and money by resolving

common requiring situations with a repeatable pattern.

Question: Who is the system for?
Possible answers: it’s for the internal product team, developers,

designers, managers, customers, external product teams...

The most important question: Can we afford it? And if we can,

which amount of time (time=budget) can we put into building it?

One step forward would be to define why (purpose), how (mission),
and what (vision) we want to achieve; define brand/product/team

values - the ideals that will guide our choices.

But if your project is small, having clear goals might be enough.

---

## Seite 71

bf

Key takeaways

- It's essential to identify current problems and needs
  because we create a design system to solve those

problems. And possible future issues, for sure.

- To identify problems, we should conduct product and
  business research, conduct call sessions, ask the team

the right questions, and conduct a proper audit.

- Aclear set of shared goals helps focus on priorities, take
  the right actions, and align the whole team in one

direction.

=

Homework

- Follow the steps, identify and document current

problems and needs in the Figma file.

- | was hoping you could answer all questions | proposed.
  Then, after you do, formulate and document your design

system goals.

---

## Seite 72

Design system team

After you settled that you need a design system and ensured that
you're ready for it (have enough resources) - it's time to take the

next step.

You may need a proper team to implement and maintain the

Q

design system as an ongoing process.

Table of contents

- How big should the team be?
- Design system team roles
- Design system team types

e From where to start

---

## Seite 73

How big should the team be?

The first questions that come to mind:
How big should the design system team be?

What kind of roles are needed?

Team size and roles inside depend on: budget and time available,
skill sets needed, product size, and scale. Most of the time, it’s just

designers and front-end developers.

Design system team roles

Designers - responsible for the general design library and style
guide, communication with other designers in the product team,
setting the design tokens, creating color and typography systems,

designing the components, and setting patterns.

Designers typically use the design system daily and so often take

control of the design system’s management.

Engineers - responsible for the component library, technical
documentation, communication with other developers in the
product team.

They turn the design into a real, working product.

UX researchers help to decide what to include in the design

---

## Seite 74

system as they find and communicate the users’ needs.

UX writers/content designers - responsible for the language used
in the system (names of components and their elements,
messages to users), helps with documentation on the design

system website and other information materials

Accessibility experts - responsible for the availability of the

system.

Team lead/ Product manager - responsible for the strategy,
teamwork planning, communication with system users and

decision-makers.

? Note: in small companies and startups, one person can hold
several roles, while in big companies, a team of 50 people can take
one role. Example: UI/UX designer in the startup - takes all work,
while in Apple, there can be 3 UX researchers, 4 UX writers, 10 UI
designers... etc. Same works here, because as | mentioned, work on

the design system can be considered as work on the product itself.

DESIGN SYSTEM TEAM 74

---

## Seite 75

Design system team types

All team roles can come together through different team types,
which determine how and who will be responsible for the system in

the company.

The type of team can change as the business grows. As new
products appear, problems and needs change. And later on,
companies may gain more budget to improve processes and

invest more money into design systems.

There are 3 main models:

Solitary: one person rules the design system.

Centralized: a single team maintains the design system as their
full-time job.

Federated: several key players from different teams in the

company together begin to develop a design system.

? Note: a small company may not have enough budget and
resources to have a dedicated team working only on the design
system. As a result, the main product team members (designer &
developer) might start working on the design system in parallel
with their primary tasks. Usually, the designer is the one who will
manage the process, and it’s probably the best approach for

startups.

---

## Seite 76

From where to start

A successful system is born from the collaborations of those who

will later use it: designers, developers, managers, etc.

The most common approach, especially for start-ups, is when work
on the system is initiated by one or more designers who work on it
in parallel with the main work. That was my case and might be

yours.

And if you are the one who will take responsibility and manage the
process, set clear propositions and reasoning why the design
system is essential, gather people from different departures, and

make the work on the design system OFFICIALLY started.
Make sure everyone knows the type of work you're doing and what

they should do. As you grow, you can scale and improve

Processes.

DESIGN SYSTEM TEAM 76

---

## Seite 77

Key takeaways

- The set of roles in a design system team is almost
  always the same. Though in small companies, one
  person can take 3 roles (UI designer, UX designer, UX
  researcher), and in large companies (for example, Apple,
  Google, IBM), a team of ~ 40 people will have one role (UX

designer)

- Typical design system team roles: designer, UX
  researcher, UX writer, engineer, accessibility expert, and

manager.

- Team type defines how and who will create, scale, and
  implement the design system. The team type depends
  on which stage the company is currently in, on the

culture, and on the amount of resources available.

---

## Seite 78

=

Homework

- Think of the perfect team for your design system.
  How big should it be? Who should be in it and for what

purpose? Which roles do you already have, if any?

- Answer the questions and justify your decision:
  If you already have (had) a design system, what type
  would you classify it as? What type do you lean towards if
  you don't have a design system? What is the perfect

team type for your current state?

¢ Document the results in Figma.

---

## Seite 79

Design principles

Principles tie the design system to the actual needs of the

particular company.

As | have said, building a design system is like building any other
product. Without a set of principles guiding your decisions, you end
up with the same problems your design system is supposed to
solve, like design debt, inconsistencies, conflicting opinions, and

team friction.

---

## Seite 80

How to define principles?

Principles are born from the state, needs, and strategy of your

particular company! Don't try just copy it from others.

To define principles, try to answer the questions below:

What are we trying to achieve with the system?
@ Higher consistency of interactions?

@ Better craftsmanship?

@ Faster implementation?
e

More accessible Uls?

Who are we targeting? What do our users need?
@ Mobile focus?
e@ Accessibility?

@ Different languages? International?

What do we value as a team? What is most important for us?
@ Speed?
@ Consistency?

@ Scalability?

---

## Seite 81

Suggestions

Defining principles can seem like an overwhelming task, so here

are some suggestions.

Plan “defining design principles” task, and decide who is
responsible for it. When nobody explicitly owns the responsibility, it'll

never get done.

Inspire from others.
It might be hard to define something solid, if you have no idea how

principles can possibly sound or look like. So | always recommend

doing research. Check Design Principles FTW and Principles.design.
These resources contain a collection of design principles from

Aironb, Intercom, IBM, and more.

Brainstorm and collect data.

Invite all team members to participate in the process of creation:
developers, designers, content writers, managers, ect. As everyone
will participate in the creation process - it will be more likely that
everyone will actually follow these principles. Create surveys,

discussions and collect all raw data.

Make sure principles don’t contradict users’ needs.
For example, you want your product to be simple and less detailed,
but users complain that they don’t understand the context or don’t

get enough information.

---

## Seite 82

Choose ~5 main principles
Work through a process of combining, refining, and evaluating all
data, until you've arrived at a comprehensive and distilled set of

principles.

Document, communicate and make the principles easily visible.
Print them, post your principles on the office walls, create a
computer desktop wallpaper, add them to your design systems
site to keep them top of mind.

Reference the principles in a meeting when you're rational about

certain design decisions..

---

## Seite 83

bf

Key takeaways

- Design principles make design and product decisions

more meaningful and consistent.

It's good to inspire by the top companies, but don’t copy.
Design principles should align with your company's
actual needs and values. So try to formulate them based

on the current conditions of the product/business.

Design principles exist for the whole team. So conduct
brainstorming sessions, get feedback and integrate

them into work processes.

- Remember, you can change principles later.

---

## Seite 84

=

Homework

- Explore the design principles of your favorite and
  competitor companies. Check Design Principles FTW and

Principles.design.

¢ Formulate design principles for your design system

based on the chapter material.

- Document results in Figma.

---

## Seite 85

Foundations,
AKA style guide

---

## Seite 86

Tokens

Everyone out there is talking about tokens, and it’s for a reason.

In this chapter, I'll explain tokens basics, and in the following
chapters, we will cover tokens specifically for colors, typography,

spacing, and sizing.

Q

Table of contents

What are design tokens?

When should you and shouldn't use tokens?

Tokens’ benefits

Token types

Naming conventions

Theming: what and how

Do’s and don'ts

Tokens implementation

---

## Seite 87

What are design tokens?

From the perspective of the atomic framework, tokens are the

smallest building blocks of the system - like quarks, you know :)

Tokens Molecules Patterns

ose @)

Atoms Organisms Pages

They contain information about the fundamental parts of the visual

language, such as:

@ Colors @ Border radius

@ Typography @ Border width

@ Sizing @ Effects (shadows, blurs..)
@ Spacing @ Elevation

Tokens help to go from design to code seamlessly.
They’re used instead of hard-coded values to ensure flexibility,
clarity, and consistency. See the example below: static value, such

as hex code for color, replaced with a self-explanatory name.

---

## Seite 88

Value Token

[| #FA4085 [| color-primary

The token’s value can be: a color, a typeface, a measurement, or

even another token:

Global token Alias Token

L | pink-500 | cta-background-color

As you understand that, let’s reconsider the atomic framework in
relation to tokens. The very essence, the smallest piece, is the raw

value itself, and a token is this raw value + a shell (the naming).

black-900

Name

#282829

Raw value

Token = Raw value + name

---

## Seite 89

And as there can be several names - several levels of abstraction
(we will cover that in the token types part) - there can be several
shells (naming layers), which won't change the essence - the raw

value itself.

Component-specific Name

Alias Name

Global Name

Raw value

TOKENS

89

---

## Seite 90

When should you and shouldn’t use tokens?

Tokens are most helpful if:

@ You use a design system for more than one platform or product.

@ You want an easy way to maintain and update your product's
styles.

e@ You plan to update your product's design or build new products

and features.

And they may be less helpful if:
@ Your existing app uses hard-coded values that will not change in
the next 1-2 years

@ Your product does not have a design system

---

## Seite 91

Tokens’ benefits

Easy to make changes later.

Suppose the developer uses the raw value in his code. In that case,
he will have to go back again and manually rewrite it, which is
painful, time-consuming, tedious, and just not intelligent and

scalable. Tokens solve this problem.

Easier interaction with developers.

Communication is essential. It is easy to say, “We had a call with
Marina today” or “We had a call with that girl. She has long hair,
green eyes, etc.” - | hope you chose 1. In the same way, it’s easier to
say - we will use “blue-500” for the CTA, then #695845.

Reduced chance of errors.
Manually entered values may need to be updated and may
contain errors. Tokens remove the burden of responsibility for

errors from the developer.

Easy scale on all platforms.

For example, developers use different programming languages to
define color on various platforms. For the Web, it’s - SAAS, LESS,
Stylus; For iOS - JSON, for Android - XML.

Tokens can be exported in JSON format and compiled into
platform-specific code. So by describing the core values of the
system (colors, padding, typography, etc.) in tokens, we can scale

and update our system quickly.

TOKENS 91

---

## Seite 92

We can change the value once in the tokens file, which will

automatically update on all platforms. Using YAML (another

language) can be the next step to empower your token system.

Tokens, exported in Json format, and

compiled into platform-specific code.

ios

Design decisions

Token data
JSON

Token data

Tokens as variables —| Tokens as variables

XML Stylys : LESS

Android
Tokens as variables

SYAVANS)

WEB

This way, design tokens create one source of truth

TOKENS

92

---

## Seite 93

Token types

Tokens can take different levels in the hierarchy. Therefore, the way
to organize and structure a token system will depend on how many

levels of abstraction you would like to have.

Component BB color-background-button

Raw value OB #F4083

a
Reach

Raw values.
These are the raw values in code, such as color values (HEX, rgba),
absolute and relative length & size units, percentages, numbers,

etc. These are not tokens.

Global tokens.
These are primitive values in our design language, represented by
context-agnostic (generalized) names. For example, with colors,

global tokens refer to “what they are.”

All design foundations start with a global design token and a value.

TOKENS 93

---

## Seite 94

This single token is later inherited to alias tokens representing a

specific context or abstraction in a design.

Value Global token

OR #Fa4os82 B® pink-500

Alias tokens.
They relate to a specific context and communicate the intended
purpose of a token. Alias tokens are practical when a single value

appears in multiple places.

So instead of referring to colors by “what they are,” you can ‘also’

refer to them by “what they do.”

Global token Alias tokens

[| pink-500 | color-cta

| color-notification

Component-specific.

They are the representation of every value associated with a

---

## Seite 95

component. They often inherit from alias tokens but are named in
a way that allows engineering teams to be as specific as possible

in applying tokens in component development.

Alias tokens Component specific

[| color-cta — | color-button-primary-bg

Token types are your guiding force for naming. However, you can

use a different logic as long as others will understand it too.

Naming conventions

The key to a design token structure is consistency. We must use a
predictable naming convention so design system users can easily
find tokens and scale the system.

\*Design system users - designers, developers, etc.

Names should be meaningful, logical, modular, and consistent.
Here is one of the best practices for an alias or component-
specific token’s naming structure:

1. Category.
   What attribute are you referring to? (colors, typography,

shadows, spacing, border-radius, etc.)

TOKENS 95

---

## Seite 96

2. Property/Type/Usage.
   Where is it being used? (text, background, icon, border, body,
   heading, etc.)

3. Item/Component.
   What component is it affecting? (input, button, segmented
   control, checkbox, tab, link, etc.)

4. Sub-Item/Variant.
   Are there any variants? (primary, secondary, xl, |, m, s) All tokens
   may not have variants, and that is fine.

5. State.
   Is that an interactive component with states? (active, disabled,

inactive, hover, focus).

Example: If we wanted to create a design token for a primary active

button using this structure, it might look like this:

category item state
| |

color-background-button-primary-active
| |

property sub-item

Or can be shortened:

category item state
| | |
color-bg-btn-primary-active
| |
property sub-item

---

## Seite 97

Theming: what and how

Theming is creating different visual styles based on your main
system. In the current context, a theme is a set of tokens that allow

you to change the style of a product.

Theming is needed if:

@ You have a group of products with different styles

@ Your design system supports multiple brands or sub-brands

@ Your product supports customization: allows the user to change
styles

@ You create a dark theme

How to create a theme?

1. Decide which elements will change.
   With button examples, it can be typography, size, corner radius,

color, shadow, etc.

Theme 1 Theme 2
Typography Roundness Color

2. Consider a naming system.
3. Create a set of tokens for the parameters that will change

(color, typography, etc.)

---

## Seite 98

Theme 1 Theme 2

GB #s508rs OB #Fa4os3

BB biue-500 B® pink-500

color-primary

color-bg-btn-primary

4. Create themes, applying all other tokens.

Theme 1 Theme 2

color-bg-btn-primary color-bg-btn-primary

typography-btn-primary typography-btn-primary

---

## Seite 99

And here is the point you should understand: we use identical
names for tokens, only raw value changes - that’s where the power
of tokens comes from. This was just an example, your tactic,

structure, and naming conventions can differ.

Do’s and don’ts

I. Try to use global tokens only when it’s hard to tide them up to

alias or component-specific without overwhelming the system.

BB biue-500

BB biue-500 F Button
©

2. Use component-specific tokens for their respective component.

Why not use alias everywhere? Component-specific tokens
ensure that as a component's design evolves, you won't have to

retrace any higher-level design decisions that inform the

---

## Seite 100

updates.
If you decide to change the button background, using an alias

may also affect other components, which may not be desired.

| color-backgroundg-button F Button

[| color-backgroundg-checkbox F Button

3. Don’t create a token for a color that will be used only once in the
   design. Example: making a background color for a card that

showcases a new product feature.

If you use a color in more than three areas across the product,

consider making a token for it.

TOKENS 100

---

## Seite 101

Tokens implementation

Here is a brief and generalized explanation of how tokens get
implemented into a real product, just for your awareness. But, of

course, the process may look different in your specific case.

1. The designer creates/updates styles in a design tool.
   For example, you create color styles in Figma/Sketch.

2. A design tokens generator updates a centralized repository
   creating platform-specific files (JSON/YAML)
   For example, you use the Figma tokens plugin to import all

created or updated existing styles.

3. Engineers pull the new repository, add new tokens, and update

the project's styles automatically.

TOKENS

101

---

## Seite 102

Key takeaways

- Tokens are the smallest building blocks of the system,
  and include sizing, spacing, color, typography, shadows,

rounding, animation and others.

- Tokens allow us to create a single source of truth.

- There are 3 main token types: global, alias &

component-specific.

- Depending on your specific case, different naming and
  hierarchies will work better or worse than others and it’s
  almost impossible to be right about all decisions until the

end.

- Tokens open the door to cross-platform sharing & multi

product theming.

---

## Seite 103

Colors

Colors can impact all areas of the design system. Hence, we
should set it first. Then, before the UI stage - for wireframes and

sketches - you can use shades of black and white.

Setting color styles is a must, even if you don't (and won't) have a

Q

complete design system.

Table of contents

Glossary of terms

Keeping branding in mind

Color psychology

Creating a base color palette

Creating tints and shades

Naming conventions

Creating color styles
Limiting Tint & Shade Quantity

Accessibility

Color Tokens

Light & dark mode using tokens

---

## Seite 104

Glossary of terms

Before we get into the topic, | want to ensure we are on the same

line. Let's cover some terms.

HSL: (hue, saturation, lightness) is the alternative representation of
the RGB color model. | will refer to this color space when we get to

the practical part.

Hue: means color, pure color (while a tint is hue+white, and shade

is hue+dark).

Saturation: range from pure color [100%] to gray [0%]
(desaturated)

Lightness: define how white the color is, ranging from pure black
[100%] to white [0%]

---

## Seite 105

Base color: primary color in the extended pallet.
Tint: a lighter value of a color.

Shade: a darker value of a color.

Tints Base Shades

Keeping branding in mind

First, you should understand that your palette should rely on
branding. Think of Duolingo or Aironb. Which colors and what
feeling comes to your mind? They don't only have different colors

but the whole branding system and tone of voice.

| oeetnge

COLORS 105

---

## Seite 106

Color plays a huge visual role in branding and UI design, so colors

must be consistently used across print and digital interfaces.

If we talk about big companies and products, there is a separate
person - A Brand Designer - who does the branding part. In
contrast, Ul Designers will use a brand's color palette to pick out
which colors to use for backgrounds, text, buttons, and other UI

elements.

But in small companies and start-ups, there might be only one
person responsible for branding, UX, Ul, writing, etc. And that might

be you.

I'll propose a simplified way to choose primary and secondary
colors, though feel free to dive deeper into branding and explore

more.

Color psychology

If you don’t have branding yet, use color psychology.
For example: if I’m designing a finance app - | can use blue

because it stands for trust and security.

There are a lot of colors, hints, and options. | will give you an
example of some of them because all of them may not fit in this

format.

COLORS 106

---

## Seite 107

Stands for: excitement, passion, danger, energy, and action.
Cons: it can trigger danger, so use it sparingly.
Brands: Coca-Cola, YouTube.

Tip: If you want to add it to your website, save it for the call to

action or sale icons.

Stands for: creativity, adventure, enthusiasm, success, and

balance.

Brands: Nickelodeon, The Home Depot.

Stands for: stability, harmony, peace, calm, and trust.
Cons: very popular, may be hard to stand out.
Brands: Facebook, Twitter, Skype, Walmart, Oral B.

? Note: it’s very popular for products that try to give a sense

of professionalism and efficiency.

---

## Seite 108

Stands for: growth, fertility, health, generosity, nature, and

cleanliness.

Cons: green is also a successful color, so you'll likely have to

use another color for success elements.
Brands: John Deere, Shopify, Spotify, Roots.

? Note: used by apps that are associated with ecological

and sustainable products.

Stands for: power, nobility, luxury, wisdom, and spirituality.

Cons: it can cause feelings of frustration. Avoid using the

color too much.
Brands: Hallmark, Yahoo.

? Note: often used in esoteric app interfaces or those

associated with royalty, decadence, and class.

COLORS 108

---

## Seite 109

Black & white

Stands for: power, elegance, sophistication, and minimalism.

Cons: it can also evoke emotions such as sadness and anger.
Brands: Channel, Nike, Adidas, Asos.

? Note: monochrome app interfaces provide an ideal blank
canvas on which users can project their ideas and

inspirations.

Creating a base color palette

Primary color

The primary color is the "brand" color and is used across alll
interactive elements such as buttons, links, inputs, etc. This color
can define the overall feel and can elicit emotion. You can have

more than one primary color, but | recommend starting with one.

Primary: Quite often blue
#356BF8
is the safest choice

---

## Seite 110

Accent colors

These act as "supporting" colors to your primary color. They can be
called “secondary” or “tertiary.” Accent colors help grab attention

or to support your primary/brand color.

Accent: these colors

#FA4083

are optional

Feedback colors

Colors are also used to provide visual feedback to users as they
use the interface. For example, red means errors, green means
successful actions, and orange means warnings. These colors

should be clearly defined and used consistently.

e Error colors are used across error states and in “destructive’

actions, such as removing a user from your team.

@ Warning colors can communicate that an action is potentially
destructive or “on hold." These colors are commonly used in

confirmations to grab the users’ attention.

e@ Success colors communicate a positive action, a positive trend,
or a successful confirmation. If you're using green as your
primary color, it can be helpful to introduce a different hue for

your success green.

---

## Seite 111

#F541355 #FBAOI8 #38CE47

Error Warning Success

‘P Protip: use colors that match the overall feeling of your product.

Keep in mind saturation and lightness.

COLORS mM

---

## Seite 112

Neutral colors

They are the foundation of the color system. Almost everything in UI
design — text, form fields, backgrounds, dividers — is usually

neutral.

Recommended method: change lightness.

Take your primary color, make two copies and change the
lightness value. For example to 8 & 98 respectively. You can also
decrease saturation up to 20. This way, your neutral colors will still

have the same hue and ‘feeling.’

H:225 S:20 L:8

223 S:20 L:98

H:225 S:93 L:59

---

## Seite 113

Creating tints and shades

We created a base color palette by choosing primary, secondary,
feedback, and neutral colors, but we need more. We need
additional tints and shades of the base color to cover different use

cases.

I'll show you several methods for creating an extended color pallet.

Shortcut: use Tailwind pallet

You can use Tailwind CSS color palettes as a base. Then, if you
need - you can tweak colors. It is a great starting point if you dont

have your specific branding in mind.

You can search in the Figma community "Tailwind colors’ or just
Google, and you will land on their documentation page. I'll save

links in the resources section.

---

## Seite 114

Automated way: use a plugin
As an example, | will use our primary color. But first, let's follow the
steps:

1. Take your base color — which will be in the middle between
   your tints and shades.

2. Run the “Color, Tint & Shade” generator plugin, input your
   base color hex value and generate the pallet. Here I’m using
   Figma.

3. Add or tweak shades. For me, the lightest tint is still dark; | would

add one lighter shade. But you can tweak existing tints.

#356BF8

\_s4| Color, Tint & Shade Generator x

Base Color

P| #356BF8

---

## Seite 115

Manual way: play with lightness

Here we will play with lightness and saturation.

1. Take your base color — the first step is the same.
2. Create tints. Add ~ +10 to the lightness value.

3. Create shades. Subtract ~ +10 from the lightness value.

H:223 S:93 L:59
H:223 S:93 L:69 H:223 S:93 L:49

H:223 S:93 L:79 H:223 S:93 1:39
H:223 S:93 1:89 H:223 S:93 L:29

H:223 S:93 1:95 H:223 S:93 L:19

‘P Pro tip 1: increase saturation as you get further from the base

color (~50% lightness).

Because in HSL color space, as we create lighter and darker

shades, the saturation impact decreases, and color starts to look

---

## Seite 116

washed off. Changing the saturation is a tiny tweak, but UI is all

about such tiny things.

5:50 .:90 “580170 S:50 L:50 S:50 L:30 S:50 L:10
S:70 90 S700 S:50 L:50 S:60 L:30 S:90 L:10

? Note: since our primary color already has high saturation=93%,

we don't need to increase it even more, though you can play with it.

‘P Pro tip 2: increase hue to make a color lighter, and decrease to

make it darker.

Sometimes it’s good to change the hue, to make sure that your

colors look rich and not dull.

51:90 170 H:51 1:50 H:51 1:30 H:51 1:20
55 1:90 88.70 H:51 L:50 H:45 1:30 H:40 L:20

Here is what happens if you change the hue in the opposite

direction:

COLORS 116

---

## Seite 117

42 90 oe H:51 1:50 H:56 L:30 H:57 L:20

Create grayscale

| already showed how you could create neutral colors from your

primary color by changing lightness and saturation value:

H:2235 S:20 L:8
H:223 S:93 L:59

223 S:20 1:98
Now let’s create a grayscale from it. Use the same manual

technique | showed you above and pro tip 1.

Add + 10 to lightness and decrease saturation value as lightness

comes closer to 50%. That’s what | have:

---

## Seite 118

$:15 L:18 S$:12 L:28 S:11 4:38

S:10 L:60 S14 L:80 16 1:90 20 1:98

Shortcut: use pre-made pallets.

If you don’t want to create a neutral pallet manually, check the
tailwind CSS color library. Do you want a slight hint of blue to bring
more liveliness to these colors? Or do you want it to be completely

neutral? It’s up to you.

50 #fafafa 100 #f4f4f5 200 #e4e4e7 300 #d4d4d8 400 #alalaa
500 #71717a 600 #52525b 700 #3f3f46 800 #27272a 900 #18181b
50 #fafafa 100 #f5f5f5 200 #e5e5e5 300 #d4d4d4 400 #a3a3a3

500 #737373 600 #525252 700 #404040 800 #262626 900 #171717

---

## Seite 119

Naming conventions

Clear naming is a must for communication: using names like
‘primary color’ is more straightforward than some hardcoded
values (#EC4899). Agree?

It’s also crucial for maintenance and scaling.

And as we already talked about Design Tokens, it would be great if

the naming system also works for them.

Global naming

No context: Use literal color naming, like [red], [blue], and a

numeric scale, where [50] is the lightest and [900] is the darkest.

This approach is suitable for defining global pallet and using it as a

reference for alias, content-specific tokens.

blue-50 blue-100 blue-200 wee B blue-900

Semantic: Use color intent, like [primary], [secondary], [danger],

[success], [error], [accent], and the same numeric scale.

If your project is small & you are going to have only a few themes,

you can go ahead with global semantic naming.

---

## Seite 120

primary-50 primary-100 we ® primary-900

Alias & Component specific naming

We covered this one in the tokens chapter, so read it there )

category item state
| |

color-background-button-primary-active

|
property sub-item

---

## Seite 121

Creating color styles

We created a pallet; now it’s time to turn them into styles. Again, |

use Figma, but you can apply this technique to any other tool.

Let’s say we have a set of colored layers with random names.

Select frame, press Enter to select all layers, press “Ctrl+R” to

rename, Input: Primary/ (Use Number | button), and tweak to

Primary/$NOO, start ascending from 0.

Rename 10 layers x

Preview

Primary/000

Primary/100 Primary/$n00

Primary/300

Start ascending from 0O
Primary/900

That's what you will get:

---

## Seite 122

I! colors

color swatch

color swatch

color swatch

color swatch

color swatch

color swatch

color swatch

color swatch

color swatch

color swatch

I! colors

Primary/000
Primary/100
Primary/200
Primary/300
Primary/400
Primary/500
Primary/600
Primary/700
Primary/800

Primary/900

Rename Primary/000 to Primary/50. Select all layers again and run

the “Styler” plugin. Click generate styles. Done!

COLORS

vy Primary

@ 200
@ 300
@ 700
@ 600
@ 500

@ 400
© 300

200
100

50

122

---

## Seite 123

Limit Tint and Shade Quantity

You don't need 50 different shades of gray. This will only create a
paradox of choice where you wont be sure which gray to choose
for other use cases. So instead, aim for about 6-10 and use them

intentionally and consistently across all of your components.

For example, | use neutral 600/500 for secondary text, neutral 900
for headings, 200/300 for dividers and borders, 50/00 for
backgrounds, neutral 400 for secondary text in dark mode, etc.

Here is an example from my design system:

e 00 900

6-digit code 900 99

Please enter the code we've sent to 600
+1777 456 7890 400

o 300 600

Resend code in 0:58

The same goes for other colors as well. Consider use cases, and
that depends specifically on your project. A good example is an
alert component, where the darkest shade [900] can be used for

the text, while the lightest [50] is for the background. You can

---

## Seite 124

practice such a component when creating tints and shades.
Though the final solution will depend on the style you're going with,

here is an example, and both options are good:

blue-900 @ Some info message for the user. blue-50

blue-500 @ Some info message for the user. blue-50

Or consider a button, along with its states: hover, pressed/selected.

Default Hover Pressed
FButton | Button QW Button ‘“
blue-600 blue-500 blue-700

blue-500 blue-400 blue-600

Button Button Button ‘ w

Youll quickly establish a pattern. Moreover, as you get to
experience - all these decisions will become automatic for you,

and you'll save yourself a lot of hours.

| may assume you aren't Material Design or Shopify, intended to
serve countless products. Therefore, you may not need to offer

endless choices.

---

## Seite 125

The more choices you provide, the more challenging it'll be to
control harmonic combinations and a consistent feel across

applications.

Pro tip 1: | usually go with 9-10 shades for primary and neutral
pallets since | also design for dark mode. For small projects, six

shades might be enough. Just be intentional in your choices.

Pro tip 2: It might happen that you don’t need too many shades
of feedback or accent colors, then you can trim your pallet up to
5-6 colors: light shades will go for backgrounds, while shades

besides the base color are for different states: hover, selected, etc.

v

COLORS 125

---

## Seite 126

Accessibility

Accessibility is a huge topic. We will cover just some basics.
| recommend you follow WCAG 2 guidelines to make a product

more accessible.

Color contrast checker

Aa 4.99

WCAG contrast ratio recommendations.

The color contrast between background and foreground content

(usually text) should be great enough to ensure legibility.

When designing interfaces, the WCAG guidelines recommend the

following contrast ratios:

---

## Seite 127

Minimum Enhanced

ratio - AA ratio - AAA
Components, :
icons, graphs

Not everything must meet the 4.5:1 requirement.
As you can see, not everything should pass 4.51:1 contrast ratio.

For components, 3:1 ratio is enough.

| Ratio: 4.26 | | AA | AAA |

Contrast ratio here:
3:1- AA & 4.51:1 - AAA

Large text (larger than 14px bold , or 18px regular) must have a

contrast ratio of at least 3:1.

| WCAG 2.92 | | AA | WCAG 3.67 | AA | AAA |

---

## Seite 128

Though, color contrast isn’t enough... Both buttons below pass AA

WCAG standards, but right example not accessible at all.

Ratio: 4.26 Ratio: 4.26

a

WCAG isn't dogma.
Dont follow WCAG standards dogmatically; use them to guide your

design decisions, not dictate them.

White text's brightness contrast is an example where those
standards aren't applicable. Both buttons below have the same
background, but one has white text, and the other has black. If you

ask normal-visioned and color-blind users, the majority will say -

white text is easier to read (source). But the accessibility color

contrast ratios tell the opposite.

Harder to read Easier to read
Passes WCAG .\_ \_.. Fails WCAG

. ’
Vv Vv

COLORS 128

---

## Seite 129

The contrast ratios failed because white is 100% luminance with no
hue or saturation and is the strongest form for contrast. So when
you compare high luminance with high luminance, WCAG will

render low contrast computationally.

Does the gray text feel like a disabled state?

Some beginners worry that gray text may feel inaccessible, but
they shouldn't. Another worry is that gray buttons may look
disabled.

Usually, disabled components have a lower contrast ratio and may
not pass WCAG standards. This is okay since users don’t bother

with it; that is the intent of a disabled button.

Secondary button Disabled button
Next Next

---

## Seite 130

Don't rely solely on colors.

Use supportive text and iconography for all necessary commands.
For example, red often indicates an error in a text field.

However, in the instance below, red is not enough to indicate the
error state because red would appear black to color-blind users.
Therefore, you need an extra cue, such as text or an icon, to

indicate the error state.

No extra cue Icon and text cue

Email Email\*

Ex: gumroad@gmail.com Ex: gumroad@gmail.com

@ Please enter your email

---

## Seite 131

Color tokens

? Reminder: Design Tokens are used in place of hardcoded values
to build and maintain a scalable, consistent design system.

Read more in the “Tokens” chapter.

Creating global tokens.

We are going to use the plugin “Figma tokens.”

? Note: | assume that we already created color styles.

1. Run the plugin.

TOKeNS

studio

for Figma.

2. Click styles - import styles. For example, we can import color,
   typography, and effect styles. Click Import. You'll see a list of all

styles you have. If you don’t need some of them, delete them.

---

## Seite 132

Import styles
What styles should be imported?

Import styles

Color
Text
‘ Shadows

Gancel.|\_\_\_\_- - .
SQ

Done. Congrats, you've made your first tokens:)

Create styles

Load Export Styles v

vy Color

v Primary

In the same way, you can update tokes by importing styles again:

Existing Tokens Update all

Primary.900
{"color":"#0033e533","type":"dropShadow","x":0,"y":6,"blur":16,"spread":0} #1e3a8a

-

Primary.800
{"color":"#0033e533","type":"dropShadow","x":0,"y":6,"blur":16,"spread":0} #1e40af

-

It also works the opposite way - you can update tokens in the

plugin and export them - it will update your styles.

COLORS 132

---

## Seite 133

Creating alias tokens.

Alias tokens are helpful if you have a multi-brand/theme design

system.

? Note: all tokens support references to one another, so for
example, if you want to alias {color.text.accent} to colors.blue.600,
then you'd write {colors.blue.600} as a value. This means that we

can use our global tokens as a reference:

color-text-base ® neutral-900
color-text-subdued @® neutral-600

color-text-accent B blue-600

So we refer to a global token and take the raw value from it. This
allows us to change [text-subdued] to another value, for example,
[neutral-500], without changing the color pallet itself: | just change
the reference. So tokens are easily understood if you think of them

from a developing perspective.
® neutral-600

color-text-subdued

® neutral-500

COLORS 133

---

## Seite 134

Or, if you have several themes, you don't have to change the

naming. Instead, you can reference another value:

® pink-600

color-text-accent

@® biue-600

So let’s create some alias tokens.

1. Run the plugin.

2. Add anew token.

v Primary
00600000

3. Customize it. Give it a name and reference to a global token.
   Here you can whether type it or select the value from the

dropdown:

Name

Text.Accent

Color
#000000, hsla(), rgba() or {alias}
Primary.50 #EFFGFF
§ Primary.500 #3479E9
Bi Primary.700 #1D4ED8

COLORS 134

---

## Seite 135

Done. The same way | added [Text.Base] & [Text.Subdued]. So now

we have global and alias tokens.

y Color = +
vy Primary
0000008
v Neutral
°0eeeee@
v Text
eee
Subdued

-

{Neutral.600} #52525b

Light and dark themes using tokens.

Tokens are handy for the creation of flexible systems. Let's start with
the foundation - a global system, then build a light [default] theme
on top of that, and after that, we will quickly create a dark theme by
tweaking values. The most important here is to create a good
structure and set proper naming conventions. Of course, that will

depend on your project, scale, and needs.

To use the ‘theme’ feature, you will need to upgrade to pro in this

plugin; I'll explain techniques for a free version.

Foundation.
Using the same technique, add any colors you need; that can be

primary, secondary, neutral, and feedback extended palettes. You

---

## Seite 136

CUI UISY USS IMUIS UNSUUCL HUIS. VIUG, YlUy, YICCII, Cle...
The typical approach is to add 2 base colors: pure white and black

since you can use them with different opacity levels.

[se] Tokens Studio for Figma (Figma Tokens) x
Tokens a 4°
global v Q Search Theme: None v |= | {}
global ¥ Color =t+
light theme @ °
dark theme Piney Foundation
New set + [|—r/O@00e00ee@
y Neutral
eeeeee
y Success
ETT TTT
y Warning +
~ee50e5ee5oeoe
y Error
SET TTY fT |
Light theme

Here you can create an alias or component-specific tokens.
| created a simple set just for education purposes [foreground/
primary or secondary], [background/primary], [controls-bg/

primary or secondary/ default or hover or pressed].

COLORS 136

---

## Seite 137

8 Tokens Studio for Figma (Figma Tokens) x

This is “Theme” feature,

or’ .
Tokens and available for PRO
“%
light theme v Q Search Theme: None v B {}
global ¥ Color =4+
light theme

y foreground

dark theme e@ @ Lig ht theme

New set + ¥ controls-bg
y primary
|
: eee
t y secondary
\
| just added \* background

new set here

y Sizing +

Dark theme

Right-click on the light theme set and duplicate it. Change values:
refer to the opposite global token. For example, if you used
neutral-00 for the background, change it to neutral-900. Or

anything you prefer.

[se] Tokens Studio for Figma (Figma Tokens) x

Tokens “ 4%

dark theme v Q Search Theme: None v B {}

global ¥ Color = t+

light theme ¥ foreground

dark theme oO Dark ther Y 1e
New set +4 y controls-bg

y primary

y secondary

y background

vy Sizing +

---

## Seite 138

Just switch between modes.
Now apply token values to your designs and simply switch

between modes. No manual, tedious work required

Light theme Dark theme

What’s next? Connect to Github.
Read the guide in the plugin docs to get started with the GitHub
sync. It will tell you how to create a repository and get your access

token, which you will need.

How to be with figma styles?

A common approach is to create one separate Figma file with
global styles and components, and use Alias or Component
specific tokens in the file you design. You can use descriptions to
clarify to developers and the team that the value relies on a global

pallet.

---

## Seite 139

Properties Name text-accent

Mi 35eBr8 100%
Description Value is taken from the global

pallet: blue-600.

In code, it's obvious since developers use actual "refer." Figma

doesn't have such feature yet (but it works with the Token plugin

we just used)

‘P Pro Tip: simply export all your tokens to Figma styles.

y primary :

.

eee

:

.

.
.

vy secondary .

Import styles

O © © ied Create styles

Styles v Update

Apply to page v Load Export

That was a great start! Just keep working on it.

---

## Seite 140

Key takeaways

Colors can impact all areas of the design system. So
setting color styles is a must, even if you don't (and

won't) have a complete design system.

Keep color phycology and branding in mind when

creating color pallets for your designs.

Start by creating your base color pallet, then add tints
and shades, and reduce their amount if possible.
Remember: an abundance of options requires more

effort to choose.

Keep accessibility in mind and follow WCAG guidelines,

but dont rely on them dogmatically.

A good naming system is a base for future scaling and

ensures the design system stays stable.

Tokens are the next step in the design game. It may be
hard to set it right at the beginning, but in the long term,

you will benefit from it.

---

## Seite 141

=

- Create your base pallet by choosing primary, secondary,

Homework

and feedback colors.

- Create extended pallets by adding tints and shades.

Limit their quantity.

- Create Figma styles.

- Create some components/text blocks, apply your color
  styles, use the “Contrast’ or "Ally - Contrast check’ Figma
  plugins, and ensure colors are accessible. Note: not all
  colors should pass the contrast ratio because some are

supportive.

- Create a set of tokens. Practice creating an alias and

component-specific tokens.

- Create light and dark themes.

---

## Seite 142

Typography

Similar to colors, typography has a significant impact on design.
So it's necessary to create solid typography styles, even if you dont
(and won't) have a complete design system.

Each random style makes subsequent product development more

difficult: harder to choose a font and more challenging to make

Q

changes.

Table of contents

- Choosing a typeface

- Best typefaces

Size units

Building a type scale

Line height

Naming conventions

Building a simple typography system

Creating Figma text styles

Building a PRO typography system [Tokens; Mobile &
Desktop]

Documentation

---

## Seite 143

Choosing a typeface

Choosing a suitable typeface is vital because it can enhance
usability, readability, accessibility, and hierarchy within an

interface.

There are a lot of factors to consider before choosing a good font
for your system. It would be best if you thought of: Personality,

Pairings, Multiple systems, App performance, etc.

The most important thing is to have a goal in mind. Ask yourself,
"How do | want the audience to react to the text?" and let it guide
the process. The right font for a task has a combination of legibility
and readability and is appropriate for the audience and the

message.

Tip 1: Go with UI oriented fonts.

Look for typefaces designed to work well on screens as a UI font.
These will generally have large x-heights, consistent and legible
characters, and multiple weights.

A neutral sans-serif typeface will never let you down. This is an

excellent choice until you get more experience.

It can be tempting to seek out different fonts, script fonts, or other

unique fonts for every project. Perhaps you've seen web designers

TYPOGRAPHY 143

---

## Seite 144

use a combination of serif and sans-serif fonts; if you're
comfortable tackling this — fabulous! However, remember that this

can take a lot of work to get right.

If you're just starting, keep it simple.

This is your This is your This is your
heading heading heading
DotGothicl6 DM Serif Display Poppins (Sans Serif)

Tip 2: Explore large design-focused companies.

You can pick a typeface that a large design-focused company is
already using — you can bet that they’ve done the research and

chosen a high-quality typeface.

‘P Pro tip: Use the “Inspect” tool in the browser to see what
typefaces other websites are using. Simply right-click on particular
element and select the Inspect, it will directly open editor, console,

sources and other tools.

---

## Seite 145

p 700 x 62
Color #FFFFFF
Font 20px Silka, sans-serif
Margin Opx Opx 24px

hy wnt SETS

ACCESSIBILITY

Name
Role paragraph
Keyboard-focusable 1S)

f? | WhatFont

Silka - 700

atttttt i |

AaBbCcDdEeFfGgHhliJjKkLIMmNnOoP;

vy

Pro tip: Some companies may use paid-premium fonts, as in the
examples above. Try out some free modern fonts first before
making a decision. Often, they're so similar that it's not worth the
investment. Especially if you are a start-up, there is much more to

invest first.

---

## Seite 146

As you explore more and more, you will see what typefaces are
often used, and you will better understand which typography is

good and which isn't.

Tip 3: Choose a font that has at least 5 weights.

It's a great indicator of quality and means that the font was crafted

with a little more care and attention to details.

Usually, it’s light, regular, medium, semibold, and bold, along with
their italic versions. Though, | don’t recommend using lightweight

and anything lower.

Bold I know You got it. Medium | know You got it.
Italic bold | know You got it. Italic Medium | know You got it.
Semibold | know You got it. Regular | know You got it.
Italic Semibold I know You got it. Italic Regular | know You got it.

Tip 4: Go with one typeface.

You might feel tempted to look for font pairings, but for Ul design, |
recommend going with 1 font, especially if you are not skilled in
typography yet. Multiple different fonts in a design can quickly look

messy and cluttered unnecessarily.

---

## Seite 147

If you really need to, use a maximum of two. Often, you'll find that
modern fonts come with enough variable weights to act effectively
as several fonts at once. Whichever fonts you decide on, limit
yourself to using just one or two at a time. Using one font at various

weights can be as effective as using multiple fonts.

CAPTION HELVETICA CAPTION POPPINS
Heading work sans Heading poppins
Body copy - big paragraphs of Body copy - big paragraphs of
text, font used - poppins. text, font used - poppins.

Tip 5: Still not sure - start with defaults.

If you don’t know which typeface to choose, go with Inter.
It’s free, carefully crafted & designed for computer screens. It has a
tall x-height which ensures the readability of mixed-case and

lower-case text.

It's a part of Google fonts and Figma interface font, so you can use
it straight in Figma without needing to download it.

Inter has its websites, where you can find guidelines on using Inter
the best way possible: You provide the font size, while the tracking

and line height are calculated through the formula.

TYPOGRAPHY 147

---

## Seite 148

I'm Inter.
Nice to meet you.

Tip 6: Consider platform-specific fonts.

Consider a font stack that adapts to the operating system: macOsS,

iOS, Windows, Android, or Linux.

Aa Aa Aa

Windows iOS, macOsS, iPadOS Android
Segoi UI San Fransisco Roboto

Best typefaces

I'm not a fan of a massive list of resources & options. Because we

know from UX design: More options - More cognitive load.

Free options. Here are my favorite high-quality free typefaces for
design projects: Inter, Dm sans, Open sans, Work sans, Poppins, and

Space Grotesk.

---

## Seite 149

Inter Dm Sans Work sans

Aa Bb Cc Dd Ee Ff Aa Bb Cc Dd Ee Ff Aa Bb Cc Dd Ee Ff
Gg Hh li Jj Kk LI Mm Gg Hh li Jj Kk LI Mm Gg Hh li Jj Kk LL Mm
Nn Oo Pp Qq Rr Ss Nn Oo Pp Qq Rr Ss Nn Oo Pp Qq Rr Ss

Tt Uu Vv Ww Xx Yy Zz Tt Uu Vv Ww Xx Yy Zz Tt Uu Vv Ww Xx Yy Zz

e

Poppins Open Sans Montserrat
Aa Bb Cc Dd Ee Ff Aa Bb Cc Dd Ee Ff Aa Bb Cc Dd Ee Ff
Gg Hh li Jj Kk LI Mm Gg Hh li Jj Kk LI Mm Gg Hh li Jj Kk LI Mm
Nn Oo Pp Qq Rr Ss Nn Oo Pp Qq Rr Ss Nn Oo Pp Qq Rr Ss

Tt Uu Vv Ww Xx Yy Zz Tt Uu Vv Ww Xx Yy Zz Tt Uu Vv Ww Xx Yy Zz

Paid options. The above free typefaces are more than suitable for
most projects. But if you want and can, invest in a “premium”
typeface.

There are thousands of options to choose from, but you should
ignore 99% of them. Here are the most popular premium typefaces
that are great for most projects and UI design in particular:

Suisse Int’! Helvetica Neue Proxima Nova

Untitled Sans Neue Montreal GT America

---

## Seite 150

Size units

A unit measures font size, line height, line length, margins, or
virtually anything in typography. There are many unit types, but
points, pixels, and ems (or rems) are the most relevant to today’s

digital typesetting needs.

Px is not a Pixel

The difference between pixels, points, and resolutions can be
confusing even for experienced designers transitioning to mobile

or unfamiliar with screens and how they work.

There are multiple types of pixels.
@ The web, written in CSS, has web pixels (px)
@ iOS instead uses the term points (pts)

@ Android uses the term density-independent pixels (dps)

These things all are roughly the same. But these are not actual
screen resolution pixels anymore - as we used to think about
pixels in terms of traditional screen displays or dot resolutions in

printing. So as high-resolution screens emerged - things changed.
When we design for the web, iOS, and Android, we use a pixel unit

that pretends the display is being shown on an old display - where

one design pixel truly meant one screen resolution pixel.

TYPOGRAPHY 150

---

## Seite 151

Because devices today have high-resolution screens, we continue

to use the traditional design pixels, and the device auto-sizes the

work to fit the new higher-density display.

So, The CSS pixel is a ‘reference’ pixel, not a device pixel.

Em and Rem

While the units above are fixed values, Rem and Em are relative
units and depend on the base font size. They are used for web
design to make it responsive and scalable, increase accessibility,

and improve overall user experience.

Pixel in design software (e.g., in Figma) is an absolute unit that

does not rely on another element's size. We all design in pixels.

1px : =: 1px

These sizes are
R...-- “always fixed

TYPOGRAPHY

151

---

## Seite 152

REM is dc relative unit that is tied directly to the base font size within
the HTML element - root font size [RFS] of the browser.
The user (you, when you open browser) or a developer(who

develop website or a platform) can change RFS.

Trem =. Root font size = = 16px (default)

3rem=48px

i<—>

If | change RFS, everything
-\* will scale proportionally

1rem=16px

Rem provides a truly responsive design. If users change their
browser settings and increase the RFS to 20px, everything will also

scale proportionally to 20px.

TYPOGRAPHY 152

---

## Seite 153

RFS =

12,5rem
(200px)

mmm 2rem (32px) J
—\_ re

Header

Description text

RFS =

12,5rem
(250px)

Header
—§|\_ na

Description text

1rem (20px)

EM is a relative unit, a multiple of the font size of the element it is

used on.

lem : =

1
Button

Fo.sem (8px)

16px = lem = parent font size

|
?0.5em (10px)
Button

20px = lem = parent font size

Parent font size

Ex. I've set base font size as
16px. And set padding as
0.5em & 1.5em.

If | change base font size to
20px, padding changes
proportionally

---

## Seite 154

Em calculation can get very messy. Since everything is sized
relative to its parent element [which can vary], the meaning of Em

changes as elements are getting nested.

In this example |
keep RFS fixed RFS | = 16px And change
Parent font size

“ERG: Header ~~ CSSIEED

Description text ce 12M (20PX) } Description text eee vem (16px) )

Parent = 18px Parent = 18px

Header bam 20m (36px) ] Header Ga 2rem (32px) )
Description text 1em (18px) Description text ee rem (16px) )

Em units Rem units

But we design in Px, so what to do?
Rem & Em - relative units. We can still design in pixels & use Rem/

Em at the programming stage. Just let the whole team be aware of
it

‘® Tip 1: Use the plugin “Measure” to hand off designs to developers.
You can always go to the plugin description page to understand
how it works. Use formula: ($)px & ($##/16)rem.

---

## Seite 155

100px - 6.25rem © Measure

-——————\_4

Some header text

100px - 6.25rem

Hescription text some description

AIDsG thelial e description text...

Units ? ($)px - (S##/16)rem

‘P Tip 2: In the documentation and the stylesheet, define both Rem

& Px values. That comes to typography, spacing, grids, etc.

text-base

Font Size: 16px / 1rem | Line Height: 24px / 1.5rem

text-xl
Font Size: 20px / 1.25rem | Line Height: 28px / 1.75rem

---

## Seite 156

Building a type scale

There is no magic number for the number of styles or sizes you will

need. The less - the better. 7 sizes could be a great starting point.

I'm not a fan of the golden ratio and major third ratio or any other
tools for creating type scales. | think it’s redundant for our specific

needs. So | always go the other way.

Step 1: Start with the base font size.

| recommend starting a typography system by choosing the base
font size (body text). Most modern UI and web use a base font size
of 16px: it is always a good default to start from as it is eligible for

users to read text on screen.

The base font usually applies to most paragraphs, body copies,

inputs, labels, menus, and lists.

5 4 7 18 19

The best options for base size

---

## Seite 157

Step 3: Add and subtract 2px.

At this point, the difference in 2px matters. Adding/subtracting 4px

- would be too much, and Ipx - not be enough and would create
  decision-making problems for designers when choosing which

font to choose.

| don’t recommend going below 10px (if your base = 16 px) and Ilpx

(if your base = 17px).

10px - This is a text sample

12px - This is a text sample

14px - This is a text sample
16px - This is a text sample

18px - This is a text sample

20px - This is a text sample

Step 3: Use an increment of 4px.

The further we go with sizes, the more the difference should be.

All sizes above 18 | consider for Heading styles.

---

## Seite 158

20px - This is a text sample

24px - This is a text sample

28px - This is a text sample
32x - This is a text sample

Step 4: Use an increment of 8px.

If you need even bigger sizes, use increment of 8, 12, 16, 24 and so

for. All sizes above 32 | would consider for Display styles.
This is what we will have so far:

10px - This is a text sample

12px - This is a text sample

14px - This is a text sample
16px - This is a text sample

18px - This is a text sample
20px - This is a text sample

24px - This is a text sample
28px - This is a text sample

32x - This is a text sample

40px - This is a text sample

48px - This is a text sample
56px - This is a text sample

---

## Seite 159

Line height

Line height or line spacing is the vertical distance between lines
within a paragraph. It is essential to ensure legibility. This
parameter depends on typefaces and sizes, and you should take a

different approach to set line height for body copy and headlines.

Line height for body copy

Body copy generally includes big paragraphs of text so that it can

be pretty dense, and users may spend a long time reading it.

To make typography in the body copy readable, you should have
more space between the lines. As a starting point for figuring out
the correct line height, | recommend multiplying the font size of

your body copy by 1.5. Then evaluate whether that's legible enough.

That multiplier can vary from 1.4 to 2x, depending on the width and
length of the content. For example, if your body text is 16px, use 1.5

multiplayer - which is 24px.

Too bad Good

Body co enerally includes _ Bod lly includes _
big iarigtacne of text so that 10 So eee

it can be pretty dense. big paragraphs of text so that

it can be pretty dense.

TYPOGRAPHY 159

---

## Seite 160

Line height for heading

With display and heading sizes, you will only need so much space
between the lines or letters. Therefore, the larger the text, the

smaller the line height should be.

Because as text gets bigger - it becomes easier to read, and there
is no need for extra line height to distinguish one line of the text

from another.

As a general rule for display text (headings etc.), aiming for 1 to

1.25x is a safe bet.

Some long ; Some long io
. headingtext |
heading text |e g
Body copy generally includes
Body copy generally includes big paragraphs of text.

big paragraphs of text.

For example, if your display text is 60px, set the line height to ~1.2 or
72px and see how that looks.

Make sure to experiment, as there is no one size fits all solution!

‘? Pro tip: If you use even numbers for text size - use even numbers
for the line height. It will ensure that your sizing in design also have

even numbers.

---

## Seite 161

Naming conventions

The right name can help designers understand when and where to
use a text style and help developers identify if the typography they

are implementing already exists as part of the design system.

Coordinating your text style names with your engineering team in

advance will significantly simplify the hand-off process.
You can take a few different approaches to name text styles:
Sized-based naming system (XS, S, M, L, XL)

The semantic naming system that corresponds to respective HTML

tags in production (caption, paragraph, hi, h2)

The descriptive or functional naming system that explains the

styles’ intended use (alert, modal-header, button-label)

With a size-based approach, you may face a problem. Let’s say

---

## Seite 162

you set a system, and now you need an extra value between
XSmall and Small. As you get in between values, it turns into a

mess: should it be the smallest? Or what?

So it’s better to associate number values, or think ahead and
create a detailed typography system so that you won't need any

size in between.

The descriptive naming approach can help you communicate
where these styles get used. That said, you'll likely create more
styles with this approach (since some styles may share the same
properties) hidden behind a more descriptive name to help

communicate their intended use.

Building a simple
typography system

We covered everything needed to create a solid typography
system. Let’s blend it all, use the type scale we created, set line

height, use naming conventions knowledge, and build it.

? Note 1: | will use Inter and for the line height, | will rely on the best
metrics from their official website, which can work for most fonts. |
don't recommend tweaking letter spacing if you're just starting in

design. If you choose the right font - it’s already good enough and

doesn't require any tweaks.

---

## Seite 163

? Note 2: If I'm creating a complex product with a web and app
version, and | know that the components size will differ depending

on the device, | prefer to use size-based naming.

It gives me flexibility, and I'm not getting stuck with naming
conventions and text style usage purposes. Especially at the start -

you may not know which elements you will have on the platform.

? Note 3:/ also create several weights for one font size, because |
may need a semibold - for buttons, medium - for labels, regular -
for text, etc. So, consider your actual needs. If | can do well with just

2 weights, | go with just 2.

? Note 4: Before creating styles, | create text layers, define sizes,
and properties, look at them, tweak if needed, and then turn them

into styles.

Text

| use more generic “text” naming here; you can take an extra step
and specify each style with more detailed naming: body, caption,

etc.

Text XS: Create text layer, set the size to 12, line height to 16, and
weight to regular. Duplicate twice and change weight to medium
and semibold. As a result, you will have text xs/regular, text xs/

medium, and text xs/semibold.

TYPOGRAPHY 163

---

## Seite 164

Text |@ Text |@ Text |

text xs/regular text xs/medium text xs/semibold

Follow the same logic create other styles.

Text S: size 14; line height 20; regular, medium, and semibold.
Text M: (our base size) size 16; line height to 24; regular, medium,
and semibold.

Text L: size 18; line height 28; regular, medium, and semibold.

Heading

Now let's create headings. Here | choose only one weight: which
one - is up to you, that can be semibold, bold, or extra-bold. To
choose, | look at the Ul in general and, if needed, may tweak the

weight later: it's easy when you use styles.

Heading /XS: size 20; line height 28; semibold.
Heading |s: size 24; line height 32; semibold.
Heading /M: size 28; line height 36; semibold.
Heading /L: size 36; line height 40; bold.

---

## Seite 165

Display

That may be it. But if | will also create Web marketing design -
| create Display font styles. So it depends on your design: structure,

content, and hierarchy.

Display /XS: size 44; line height 48; bold.
Display /S: size 60; line height 68; bold.
Display /M: size 76; line height 84; bold.
Display /L: size 92; line height 100; bold.

? Note: All these sizes and line-height values are not strict and just
my personal recommendation. | just apply knowledge and

techniques which were mentioned above.

Is that for desktop or mobile?

Well, It’s for both. You don’t have to split styles for mobile and

desktop specifically, since you will have more styles after that.

What You can do: If for desktop you use “Heading L” - on the
mobile version, You can go one style lower and set it to “Heading
M”. You may go 2 or 3 styles lower for “Display” styles (they are
used marketing websites and can be quite big), and keep “Body”

size the same. It depends on the specific case.

But, Ill show you how to create separate styles for mobile and

desktop, just keep reading.

---

## Seite 166

Creating Figma text styles

? Tip 1: Use the “typestyles plugin” to create styles quickly.
It helps when you have many variants of one font size.
Choose layers of the same size, run the plugin, click the custom text

“Text Small,” and click weight.

Select text layers of the same

Text layer Textlayer Text layer size and run the plugin

@ Typestyles x
u 1. Add cust
. custom 2. Name Text XS see stom
Inter modifier

- Font Family r
  Int ++ Font Size T
  nter
- Font Weight T

3. Add Font
   inter weig ht e Height

- Letter Spacing

- Letter Case

++ Paragraph Spacing

++ Text Decoration 4. Make styles

Text styles
Text XS

Ag Regular - 12/16 Here is the result

Repeat the same for Text S/M/L
Ag Medium - 12/16

Ag Semi Bold - 12/16

---

## Seite 167

? Tip 2: If you add styles manually - use prefixes.
Prefix your style names with a forward slash, for example [Text XS/
Regular] [Text XS/ Medium] [Text XS/ Semibold] ; it will group your

styles, making them easier to find and use

Add styles manually

1. Select text layer
   Layer

(Ghatiayal © Pass through 100% ©
54x16
Text
Create new text style x Text styles

Q 2. Add style
Rag 123 3. Name, use slash [ CO Browse ibrares.. J
Name Fill s+
Description HE 000000 100% oa -

Result is below. Of course, you can further group styles (2), but |

prefer to keep it this way (1).

---

## Seite 168

Text XS

Ag Regular - 12/16
Ag Medium - 12/16
Ag Semibold - 12/16
Text S

Ag Regular - 14/20
Ag Medium - 14/20
Ag Semibold - 14/20
Text M

Ag Regular : 16/24
Ag Medium - 16/24
Ag Semibold - 16/24
Text L

Ag Regular : 18/28
Ag Medium - 18/28

Ag Semibold - 18/28

TYPOGRAPHY

Heading

Ag XS - 20/28
Ag S- 24/32
Ag M- 28/36
Ag L- 32/40
Ag XL- 36/44
Display

Ag s- 40/48
Ag M. 44/48

Ag L 52/56

Text styles
grouped

@) Text XS

Text S
Text M
Text L
Heading

Display

(2) Text

XS

Heading

Display

168

---

## Seite 169

Building a PRO
typography system

Okay, let’s take it one level up. Let’s return to the same approach
we had for the color system. We created a global palette first, then

“alias” & “component-specific” based on it.

Global typography tokens

We will set “global” typography styles first: text-xs, text-s.... text-8xI. |

recommend you create it in a separate Figma file.

Text styles

Ag Text XL. 20/28 | used the same typescale, weights,
and line height that we set in the

Ag Text 2XL - 24/32 9 .
previous sections, only changed

Ag Text 3XL - 28/36 names
Ag Text 4XL - 32/40
Ag Text 5XL- 36/44

Ag Text 6XL- 40/48

As you see, | create different weights
Ag Text 7XL - 44/48 only for [XS,S,M,L] sizes [12,14,16,18],
Ag Text 8XL- 52/56 because they can be used in different

Ul cases.
Text XS

Text S
Text M

Text L

---

## Seite 170

Now run the “Tokens studio” plugin and import text styles.

[se] Tokens Studio for Figma (Figma Tokens)

Tokens

global v Q Search

= global y Typography
Application O Text XL Text 2XL
New set + Text 6XL Text 7XL
y Text XS
Regular Medium
y Text S
Regular Medium
y Text M
Regular Medium
y Text L
Regular Medium

x

S\ 4%

Theme: None v |= | {}

Text 3XL\_ = Text 4XL

Text 8XL

Semibold

Semibold

Semibold

Semibold

Desktop and mobile system

Text 5XL

Now, let’s create a new set of more specific tokens.

1. Click “New Set +”, call it as you wish.

2. Add typography token.

-

Here are your
global tokens

ES

---

## Seite 171

global y Opacity +

= Application
y Box Shadow +
New set
vy Typography Add a new token (2)
y Font Family +

As you can see, you can create separate tokens for so many
parameters, such as font family, weight, line-height... But we will

just use “Reference mode.”

New Token x

Name

Body.XS.Regular|

Font fontFamily value or {alias} v
Weight fontWeight value or {alias} v
za lineHeight value or {alias} v
TA fontSize value or {alias} v
[A] letterSpacing value or {alias} y
<s paragraphSpacing value or {alias} v

Now just refer to the global token and set the proper name. For

example, adding [.] or [/] creates a group.

---

## Seite 172

New Token

Name

Body.XS.Regular

Typography
Typography Value or {alias}

Text S.Regular

Text S.Semibold

Text XL

Text XS.Medium

Text XS.Regular

Text XS.Semibold

en -

INTER/SEMI BOLD/20/14/0%/0/OPX/NONE/NONE/
INTER/SEMI BOLD/28/20/0%/0/OPX/NONE/NONE/
INTER/MEDIUM/16/12/0%/0/OPX/NONE/NONE/
INTER/REGULAR/16/12/0%/0/OPX/NONE/NONE/
INTER/SEMI BOLD/16/12/0%/0/OPX/NONE/NONE/

Below is final set of tokens. The trick here is that [Mobile Heading.Hé

refers to Text L/Semibold (18px)], while [Desktop Heading.Hé refers

to Text XL (20px)], and so on: one size plus.

global y Typography

Application oO vy Body

New set + v XS
Regular
vS
Regular
yM
Regular
vL

Regular

Medium

Medium

Medium

Medium

vy Mobile Heading

H6 HS

H4 H3

vy Desktop Heading

H6 HS

TYPOGRAPHY

H4 H3

ot Body styles will be the
same for desktop and
Semibold mobile
Semibold
Semibold
Semibold

While Heading and
display styles will differ
is sizes

kK
H2 H1

H2 H1

172

---

## Seite 173

Desktop styles are
One Size Plus Mobile H6 —@aaz>

Desktop H6 —@aa=p Mobile H5 —@=azD>

Desktop H5 —@=zazp Mobile H4 —czzazp

Desktop H4-@=x=> Mobile H4 -c==>

Now you can just “Create styles”, and use figma styles.

vy Mobile Heading
Als f ib § GY) § he fe § ih

vy Desktop Heading

H5 H4 H3 H2 = 4H1 Import styles
Create styles

Load.’ Export sftes) Update

Y
Body Mobile Heading Desktop Heading
xs Ag H6- 18/28 Ag H6- 20/28
Ss Ag H5- 20/28 Ag H5- 24/32
M Ag H4- 24/32 Ag H4- 28/36
L Ag 3 - 28/36 Ag H3- 32/40
Ag H2- 32/40 Ag H2- 36/44
Here are
Ag H1- 36/44 Ag H1- 40/48

you're styles |

---

## Seite 174

You can play with naming, structure and actual parameters

» Desktop headline

» Body » Mobile headline

> text-xs Ag Hi text-4xl - 36/40 Ag H1 text-Sx! - 48/48
> text-sm Ag H2 text-3xl - 30/36 Ag H2 text-4x! - 36/40
> » text-base Ag H3 text-2x! - 24/32 Ag H3 text-3xl - 30/36
> text-Ig Ag H4 text-x! - 20/28 Ag H4 text-2x! - 24/32

Ag H5 text-xI - 20/28

But now you may ask: “Marinaaaa, why did we make all of this?

Couldn't we just create those styles from the beginning?”

The answer: Yes, we could. And we can. But if you want to create
“one source of truth” and make design easily scalable - you can

follow this approach.

Easily scalable: you can tweak global typography tokens, and
“alias” tokens will be updated automatically. Then, you can just
update your styles with one click.

You can also make changes in styles first and update your tokens

instead; that also works.
One source of truth: another great power here - you can export

JSON file with tokens, and developers won't have to change

ANYTHING manually.

TYPOGRAPHY 174

---

## Seite 175

Some other examples

Material design: you can use it for inspirational and educational

purposes. Material uses the Roboto typeface for all headlines,

subtitles, body, and captions. Hierarchy is communicated through

differences in font-weight (Light, Medium, Regular), size, letter

spacing, and case.

Scale Category Typeface
| | | Roboto
H ) Roboto
H 3 Roboto
H4 Roboto
H5 Roboto

Roboto
H6

. Roboto

Subtitle 1

Roboto
Subtitle 2

Roboto
Body 1

Roboto
Body 2

Roboto
BUTTON

Roboto
Caption

Roboto
OVERLINE

Image source: Material Design

TYPOGRAPHY

Weight

Light

Light

Regular

Regular

Regular

Medium

Regular

Medium

Regular

Regular

Medium

Regular

Regular

Size

96

68

48

34

24

20

Case

Sentence

Sentence

Sentence

Sentence

Sentence

Sentence

Sentence

Sentence

Sentence

Sentence

All caps

Sentence

All caps

Letter spacing

175

---

## Seite 176

Asper Brothers: tokens are divided into groups based on the

specificity of the value and the intended purpose.

TYPOGRAPHY

NAME

Default font-family

Heading large desktop

Heading default desktop

Heading small desktop

Heading x-small desktop

Heading large mobile

Heading default mobile

Heading small mobile

Heading x-small mobile

Paragraph large

Paragraph default

Paragraph small

Text small default

Text button default

TOKEN

$font-family

$font-size-desk-1

$font-size-desk-2

$font-size-desk-3

$font-size-desk-4

$font-size-mob-1

$font-size-mob-2

$font-size-mob-3

$font-size-mob-4

$font-size-para-1

$font-size-para-2

$font-size-para-3

$font-size-small

$font-size-button

Image source: ASPER BROTHERS.

Documentation

SIZE

66pt

36pt

30pt

20pt

36pt

30pt

2apt

20pt

18pt

16pt

14pt

12pt

14pt

WEIGHT

EXAMPLE

Proxima Nova, sans-serif

Aa

Aa
Aa
Aa
Aa
Aa
Aa
Aa

Aa

Aa

Here is a Figma documentation example. It includes style/token

name, weight, size, and line height. It’s also a good practice to

include Rem values. You can also add tracking or over parameters

if they are tweaked.

TYPOGRAPHY

176

---

## Seite 177

Tokens Typography

Typography

180123 / Version 1.1

GLOBAL TOKEN NAME

text-6xl / bold

text-5xl / bold

text-4x1 / bold

text-3xl / bold

text-2xl / semibold

text-xl / semibold

GLOBAL TOKEN NAME

text-5xl / bold

text-4xl / bold

text-3xl / bold

text-2xl / semibold

text-xl / semibold

text-xl / semibold

GLOBAL TOKEN NAME

text-1

text-m

text-s

text-xs

FONT SIZE
40px | 2.5rem
36px | 2.25rem
32px | 2rem
28px | 1.75rem
24px | 1.5rem
20px | 1.25rem
FONT SIZE

36px | 2.25rem
32px | 2rem
28px | 1.75rem
24px | 1.5rem
20px | 1.25rem
18px | 1.125rem
FONT SIZE

18px | 1.125rem
16px | lrem
14px | 0.875rem
12px | 0.75rem

LINE HEIGHT

48px | 3rem

44px | 2.75rem

40px | 2.5rem

36px | 2.25rem

32px | 2rem

28px | 1.75rem

LINE HEIGHT

44px | 2.75rem

40px | 2.5rem

36px | 2.25rem

32px | 2rem

28px | 1.75rem

28px | 1.75rem

LINE HEIGHT

28px | 1.75rem

24px | 1.5rem

20px | 1.25rem

16px | lrem

8 | marina_uiux

STYLE/ ALIAS TOKEN NAME/ SAMPLE

Desktop Heading 1
Desktop Heading 2
Desktop Heading 3

Desktop Heading 4

Desktop Heading 5

Desktop Heading 6

STYLE/ ALIAS TOKEN NAME/ SAMPLE

Mobile Heading 1
Mobile Heading 2

Mobile Heading 3

Mobile Heading 4
Mobile Heading 5

Mobile Heading 6
STYLE/ ALIAS TOKEN NAME/ SAMPLE

Text L-Semibold TextL-Medium Text L-Regular

Text M-Semibold TextM-Medium Text M-Regular

Text S-Semibold TextS-Medium Text S-Regular

Text XS-Semibold Text XS-Medium \_ Text XS-Regular

You will find this documentation example as part of the style guide

inside the Figma files that | will kindly share with you as an addition

to the e-book.

---

## Seite 178

5

Key takeaways

- Typography has a significant impact on design. So it's
  necessary to create solid typography styles, even if you

don't (and won't) have a complete design system.

When choosing a typeface, keep readability and legibility

in mind; it’s better to go with Ul-oriented typefaces.

There are many unit types, but points, pixels, ems, and
rems are the most relevant to today’s digital typesetting

needs.

Start building typography system from choosing your
base size, then create a type-scale, define naming
conventions, define proper type settings: line-height,

weight, letter-spacing, ect.

Tokens are the next step in the design game. It may be
hard to set it right at the beginning, but in the long term,

you will benefit from it.

---

## Seite 179

=

Homework

- Choose a legible, readable, brand-aligned and UI-
  oriented typeface. Researching top brands and their

typography choices for inspiration.

Develop a type scale based on a chosen base font size.

Look to Tailwind or Material Design for inspiration.

Establish clear naming conventions.

Create a global typography system; don’t forget about
font weight, line height, and letter spacing (if necessary).

Create Figma styles and convert to global tokens.

Develop alias tokens for both mobile and desktop use,

and derive Figma styles from tokens.

Document the typography system in Figma. Don't forget

to mention rem values.

---

## Seite 180

Spacing

Consistent and scalable spacing helps to eliminate guesswork

while designing and developing because of a limited set of options.

It creates a visual balance, rhythm, structure, and hierarchy that
makes the user interface (UI) easier for users to scan and identify

relevant groups; therefore, it improves the quality of the UI.

Qn
Table of contents
¢ Glossary of terms

- Defining a spacing system
- Naming conventions
- Tokens
- Spacing usage

- Figma tips

---

## Seite 181

Glossary of terms

Spacing: [in general] the negative area between elements..

Inner spacing: [AKA padding] the spacing within the components
Outer spacing: [AKA layout spacing or margin] the spacing
between the components (+ other elements outside of a

component)

Inner spacing Outer spacing

- Button + Button

— u —
© Oo @

Spacing system: the set of possible spacing values that can be
used in a design.

Base unit: minimal value that serves as a base and increment for
the system.

Increment: an increase in a numerical quantity.

f 2x )
rei

- Button

LL u L\_

Grid system: visual guide made up of horizontal and vertical lines

that divide the design space into a series of columns and rows and

---

## Seite 182

organize and align elements within a design.

ee ee ee

Hard grid: align content to a fixed vertical grid
Soft grid: define the space between elements on the page
Baseline grid: the baseline is the invisible line upon which a line of

the text rests. A baseline grid is used to achieve vertical rhythm.

e
My text line When working with type at different
upon the sizes, our leading does not have to be
. . identical. It should be however, be
baseline grid incremental with the baseline grid.

Vertical rhythm: keep vertical soaces between elements on a

page consistent.

Without vertical With vertical
rhythm rhythm

Body copy - big paragraphs of

text, font used - poppins. Body copy - big paragraphs of

text, font used - poppins.
Body copy - big paragraphs of
text, font used - poppins.

Body copy - big paragraphs of
text, font used - poppins.

°o )

---

## Seite 183

Defining a spacing system

Proper spacing is one of the basic but essential elements of every
great design. Hence, it should be defined even if you won't have a

complete design system in place;)

Here we will follow almost the same approach we did with the

typography scale.

Start with the base unit.

The base unit determines the spacing scale and ensures visual
consistency across products. For example, looking at different
products around the web, you may see 4pt, 5pt, 6pt, 8pt, and 10pt

increment systems.

| wouldn't recommend using odd numbers [3 or 5] in the system
since it can make it challenging to center elements without

splitting pixels.

Best option 2

Best option 1

---

## Seite 184

Most modern UI and design systems are built on a grid system
foundation. Some of these systems opt for a ‘hard grid’ approach,

which boxes elements in the design to a rigid 8px grid.

Constraints are reasonable but to some extent. We should find a
balance and build a system that will simplify our work while giving

us some room for flexibility.

| prefer a 4pt base unit, so my spacing choices will always be
divisible by 4. It allows for more nuanced spacing options and

helps establish a more harmonious vertical rhythm.

Some people may insist that it can open up to too many variables
in the system: I'll say it depends on your needs. If you work with web
design, an 8pt base unit can work well. For digital product design, |
use more nuanced spacing at a lower scale and the non-linear

approach at a bigger scale.

SPACING 184

---

## Seite 185

Spacing scale

The scale is a limited set of spacing values that are used to lay out
Ul elements in a consistent way. Each spacing value is a multiple of

the base unit. Simple math, right?

But to make things easier, limit your options and define a restricted
set of spacing values. For example, instead of arbitrarily choosing
124px and 128px, which both fall on a 4px grid, opt for a predefined
value of 128px that you can remember and use consistently across

designs.

So instead of going linear, go non-linear. With each subsequent
step, increase the increment value by 4, 8, 16, and so on. You can
use the golden ratio, modular scale, or a similar geometric

progression that could double each step.

X Linear Non-linear

SPACING 185

---

## Seite 186

Naming conventions

The simple way to name your spacing options is using a scale like
t-shirt sizes: that’s the language people can remember and apply

accurately.

T-shirt size naming may not work well for quite extensive spacing
options; then I'd recommend using a numerical scale. In this case,
naming depends on your base value's multiple. So our base is 4px

- [1], 8px - [2], 6px - [4]. This way, adding intermediary values is

also going to be easy.

T-shirt scale Numerical scale
EB $spacing-xxs E3 $spacing-01
[EB $spacing-xs EB $spacing-02
$spacing-s $spacing-03
[EB $spacing-m $spacing-04

$spacing-x! $spacing-08

You can also apply a semantic approach and create purpose-

driven spacing tokens. But whichever approach you choose for

---

## Seite 187

Check out the Shopify tokens system, link below. You'll see that they

use the numerical scale naming for all tokens; check font, spacing,

and shape.
ee --p-space-1 fi 0.25rem Use a spacing of 4 pixels -
eo --p-space-2 li 0.5rem Use a spacing of 8 pixels —
ee --p-space-3 li 0.75rem Use a spacing of 12 pixels -
ee --p-space-4 li trem Use a spacing of 16 pixels -
ee --p-space-5 fi 1.25rem Use a spacing of 20 pixels —
ee --p-space-6 1.5rem Use a spacing of 24 pixels \_
e e --p-space-8 li 2rem Use a spacing of 32 pixels -
e e --p-space-10 li 2.5rem Use a spacing of 40 pixels -
e e --p-space-12 fi 3rem Use a spacing of 48 pixels -
e e --p-space-16 i 4rem Use a spacing of 64 pixels -

Image source: Polaris Shopify

Or here is an example from Europa Component Library. Check out
their documentation, and you'll see that they use a t-shirt naming

system consistently across the typography and spacing systems.

Name Token (example) Size

4xl $layout-4xl 64px - 4rem
3xl $layout-3xl 48px - 3rem
2xl $layout-2xl 40px - 2.5rem
xl $layout-xl 32px - 2rem

I $layout-lg 24px - 1.5rem
m $layout-md 16px - 1rem

s $layout-sm 12px - 0.75rem
xs $layout-xs 8px - 0.5rem
2xs $layout-2xs 4px - 0.25rem

SPACING 187

---

## Seite 188

Spacing Tokens

We cannot create spacing styles in Figma, but we can create
tokens. Run the plugin and add a new spacing token: set the name

and value -> create token.

Add new token

global y Spacing Add a new token b+)
New set + ¥ space
none 2xs xs s m Ig xl 2xl 3xl 4xl
5xl 6x! 7xl huge x-huge 2x-huge 3x-huge
New Token x

2 Token names must be unique

space.xs
4

Description

Optional description

Create token

Cancel

One of the benefits of using tokens in Figma: If you decide to go
with 80px everywhere instead of 72px - updating one token will

update all spacing throughout your designs.

Only if you actually applied this token. What does it mean?

---

## Seite 189

To apply the token: run the “Token Studio” plugin, choose your
element/component, then right-click on the token and choose the

property you want to apply (in my case, | chose card component

and applied [$spacing-3xl] token to all top, bottom, right & left

paddings).

Name Surname
UI/UX designer

©

global

New set + + Size

nd

y Sizing

Gap,
xl

V All

y But

Top
Right
Bottom
Left

j Documentation Tokens » +

= Edit Token

. Duplicate Token

xl 2xl

Delete Token

uge x-huge

If | change [$spacing-3xI] token value, component paddings will

also be updated.

Spacing usage

Different use cases require different ranges of spacing units to

achieve the best outcomes. For example, the spacing scale can be

broken into small, medium, and large; or into inner and layout

spacing.

---

## Seite 190

02 4 6 8 12 16 20 24 32 40 48 64 80

LILITtTttt} | | | |

ees ; | \*
ses Small = Medium im Large

See the guidelines example below:

Small values: (0 to 8px) for small and compact UI pieces.

@ The gap between small icons and text

@ Container padding of small components (ex: badges, icon
buttons, table cells)

@ The gap between repeating elements (ex: button groups)

@ Vertical spacing between elements in a card (ex: a title and

description, a description and actions)

Medium values: (12 to 24px) for more prominent and less dense UI

pieces.

@ Container padding of larger components (ex: buttons)

@ Space between avatar/large icon and content (ex: section
messages)

@ Vertical spacing between elements in cards

Large values: (32 to 80px) for the largest pieces of UI and for layout

elements.

@ The space between content on the page (ex: spacing between
the top of the page and the header)

@ Alignment within larger pieces of content (ex: alignment of

content in Flag)

SPACING 190

---

## Seite 191

Whatever you do, set clear guidelines for yourself and the team,

add them to documentation, and update when needed.

Figma tips

In Figma, you can change your ‘Big nudge’ amount from 10px to
8px, SO when you press SHIFT + an arrow key, Figma will move your
component by 8px. If you’re working from a 4px or 8px grid system,

it’s a Must-have.

Head to Preferences -> Nudge amount -> Big nudge -> 8px.

Theme

Q Quick actions... PSE TEN EO:
Nudge amount...
File
Edit
View
Object Nudge amount x
Text
Arrange

Small nudge Big nudg
Vector

1 8
Plugins

Widgets

Preferences

Libraries

Help and account

---

## Seite 192

5

Key takeaways

- The importance of proper spacing in design cannot be
  overstated. It impacts legibility, readability, and visual
  hierarchy, making it a crucial factor in typography and

layout design.

To maintain consistency and efficiency, develop a clear

spacing system for using in your designs.

A soft 4pt or 8pt grid is a common choice in modern UI

design.

When creating spacing scale, opt for a non-linear
approach to reduce guesswork and improve consistency

and vertical rhythm.

Adopt a simple naming convention, using the same logic

for spacing units as in typography.

---

## Seite 193

=

- Choose a base unit for your spacing system. It could be

Homework

Apt or 8pt (or any other value that you prefer).

- Define a limited set of spacing values that will be used

to lay out Ul elements in a consistent way.

- Choose a naming convention and be consistent with it.
  You could use a t-shirt size, numerical scale, or semantic

approach to name your spacing options.

- Create spacing tokens. Apply them to some UI elements.

Play with it: update tokens, see how UI changes.

- Research Shopify and Polaris spacing & tokens system.

---

## Seite 194

Grids and layouts

Grids are one of the fundamental building blocks of a well-
structured, organized design. They define structure, hierarchy, and
rhythm, guiding you through creating a layout. So Think of grids as

guidelines for creating your layout.

Working from a defined layout system allows you to work faster
and more consistently, removing guesswork as you lay out

responsive designs.

Q

Table of contents

Glossary of terms

Breakpoints

Grid types

Layout types

Creating grids

Complex layout grids
Grid Tokens

---

## Seite 195

Glossary of terms

Grid: [In digital design] a network of straight vertical and horizontal

lines laid out in a pattern that helps maintain balance from page to

page.

-—\_——— a ee tC ee iO et dt

Columns: vertical spatial areas that hold content within the grid.

A 12-column grid is the most common grid layout.

Rows: horizontal columns.

They can be used to create rhythm on your page; they aren't used

as often. Their size can vary based on the content they contain.

---

## Seite 196

Gutters: [also called grid gaps in web development] space

between columns and rows.

They separate content and provide white space within the design,

giving it room to breathe.

Margins: space between content and the left and right edges of

the screen.

They create white space around the content and vary according to

screen size, either expanding or shrinking as it changes.

Layout regions: areas of the layout that contain the content.

—CID

Breakpoints: specific range of screen sizes where the layout re-
adjusts to the available screen size for the best possible layout

view

GRIDS AND LAYOUTS 196

---

## Seite 197

Mobile Desktop

a
<478px >1024px

Breakpoints

A breakpoint in a responsive design is the “point” at which a
website’s content and design will adapt in a certain way to provide

the best possible user experience.

Let’s consider the Revolut website as an example. The user sees the
top navigation bar with log-in/sign-up buttons and links when the
website is opened on a regular desktop screen. However, suppose
the website is viewed on a mobile device screen. In that case, the
navigation will be hidden in the top right of the screen under the

menu icon.

GRIDS AND LAYOUTS 197

---

## Seite 198

Daa a 1° hs Sa | --- QOD. - - |

Revolut — eersonai susiness Revolut <18\_ Company Login Revolut =
= things money \* a all
From easy money management, to travel perks and investments. things money
ii ©
Open yom iaccounLin al lest From easy money management, to travel
perks and investments. Open your account
caN °?

Image source: Revolut.com

With the growing number of mobile devices, it is quite impossible to
create breakpoints for every device. But you can always create
standard responsive breakpoints for screen sizes that are

extensively used among your audiences.

The most used breakpoints are listed below.

320px 480px 768px 1024px 1200px

---

## Seite 199

Grid types

A grid can function in three different ways across different

breakpoints: fixed, fluid or hybrid.

Fixed grid.

Fixed grids only increase their margins as screen size increases.
Everything else — columns, rows, and gutters — remains the same

size, which means that the content also stays fixed.

Log in = 11 Log in = 11
G log in with Google G og in with Google

Email Email
[ netocarotebsio: nail.com [ netocarotabsio: nail.com

Passwort d Passwor d

ees ceeceee © eee ceeceee ©
Remember Me Forgot password ? Remember Me Forgot password ?
Pico

Don't have an account? Sign up Don't have an account? Sign up

It's useful in complex layouts and for larger breakpoints where you
want precise control over the width of the content, ensuring that it

is always displayed the way you intended.
? Keep in mind: on large screens, you may end up with awkwardly

wide margins, so design fixed layouts according to the most

common screen resolutions among your target audience.

GRIDS AND LAYOUTS 199

---

## Seite 200

Fluid grid

Fluid grids scale proportionally depending on the available space:
columns grow or shrink to adapt to the available space, while

margins stay constant.

Log in Sl Log in Sl
G log in with Google G log in with Google

Email Email
[ hello.carrotlabs| @gmail.com [ hello.carrotlabs| @gmail.com

Password Password

sec eecene © see eeeeeee ©
Remember Me Forgot password ? @ Remember Me Forgot password ?

Don't have an account? Sign up Don’t have an account? Sign up

The fluid grid is designed for complex screens and web
applications, using 100% of the screen’s width, allowing for

maximum use of screen real estate.

GRIDS AND LAYOUTS 200

---

## Seite 201

Hybrid grid
A hybrid grid has both fluid-width and fixed-width components.

Codedamn JavaScript under the hood

Which one is false about ‘let’?
This content
is fixed

follows block-level hoisiting
const’ variables cannot be redeclared

variables declared globally are available on

While top and
bottom bar scale
to the screen width

is newer, compared to

In modern layouts, a few elements can take the full width on the
screen: headers, footers, full-lbleed visible containers, or images,

while the rest of the content stays fixed.

Layout types

Layout type defines what happens with content in between the
breakpoints: what happens when we come from desktop to tablet

or mobile size?

---

## Seite 202

Adaptive layout

Adaptive layout changes entirely at different breakpoints.
This promotes a more tailored experience for the user’s device but
it can become expensive to rebuild the same functionality into

multiple formats.

Responsive layout

Responsive layout adapts to screen size and orientation.
This is a common practice on the web and has become a

necessity for native apps as screen size variations have increased.
Responsive layout grids take more forethought than fixed or fluid

grids: you should consider what screen sizes they need to

rearrange the grid and how to do that best to serve users.

GRIDS AND LAYOUTS 202

---

## Seite 203

Strict layout

Strict layout doesn’t flex with a changing format size. Fixed layouts
are often used to promote a specific interaction or informational

layout that would be degraded at a smaller size.

Data tables and graphs will often create a strict scrollable layout at
a specific size because the legibility and interactions would be

significantly degraded below a certain size.

TEAM POINTS < TEAM POINTS > PLAYED TOP SCORER

© Manchester United FC we © Manchester United FC 102 2 |} vwrv010 wiviems

@ Manchester city Fc %% @ Monchester city Fe % 2 € Christopher Nero
Uh Liverpooi re a8 UW uverpoot rc as 22 q Henry Palmer
© coeteore 64 @ cowoorc 64 22 zg Asiiey Young

GRIDS AND LAYOUTS 203

---

## Seite 204

Creating grids

Let's get to practice, first lets take a generalized steps overview,

and them create real grid of Figma ;)

Generalized steps

Step!: Start with the screen width [AKA breakpoint].
For desktops, | would recommend designing at smaller breakpoints
first [ex: 1280 or 1024 instead of 1440 or 1920] because after, you can

simply adapt to larger screens.

Design at large resolutions first [1440 or 1920] only when it’s

intentional: when your target audience uses large screens mainly.

For tablet and mobile, go with mainly used sizes: 834 or 768 for
tablet; 375 or 360 for mobile.

Step 2: Set margin width - [for fluid grids].

Margin value will depend on the screen width and specific design;

there are no strict rules.

For the desktop (web design), margins can be 80px, 120px, or 160px.
For the desktop (dashboard): 24p or 32px.
For tablet: 32px or 40px.

---

## Seite 205

For mobile, most of the time, it’s 16px | in this case we use as much
of the real estate of the screen as possible] or 20px and 24 px [

design will look better, but we sacrifice the space for the content]

That's just suggestions and recommendations—no more.

Step 3: Define layout area [for fixed grids].
Fixed grid is mainly used on the desktop [at larger breakpoints] or
tablet. In this case, we don’t define margins value; we define our

layout area, the number of columns, and the width of the gutter.

Most common layout area: 1240px, 1140px, 600px.

Step 4: Set the number of columns

For desktop, it’s usually 12; for tablet - 8; for mobile - 4.

Step 5: Define the gutter's width.

Note: the more gutter space, the less tight design will be. But don’t
go too far with it: don’t break the principle of proximity (elements

close together perceived as part of the same group)

The gutter’s width can be 12px, 16px, 20px, and so on.

GRIDS AND LAYOUTS 205

---

## Seite 206

Fluid desktop grid

Following step by step process, let’s create the desktop fixed grid

first.
}- === 2 Se ee eo Screen width - Flexible (1280 xX) iutiutietientienties tented ieee ie iediediedielielielielielieliel
fo --)- SS i — Layout region - Flexible (1216p x) ]attusitiestiastiatiesiay etait ietiedtettetetiediatieliladta! 1

l¢——>| _ 1¢—|_ Ie! _ Ie! I Ie! _ I I _ I! _ It! _ I _ 1 I

Column - Flexible

H H H H HH H H H HH

Step 1. Choose an art-board size. I'll go with 1280px (MacBook Air
frame in Figma). Press “F” -> on the right panel, choose the frame

size (or define parameters manually)

Let me first introduce you to Figma functionality.
Click [+] next to “Layout Grid” -> click on the grid -> change grid to

columns. | usually always work with a column grid.

---

## Seite 207

x Fae 8px

Layer

© Pass through

Fill

FEFFFF 100%
Stroke
Effects

Export

jacBook Air - 6
"=
G) ner
Grid
Size Color
[fe | BE FFooo0 §=— 10%
jacBook Air - 6

©)

Stretch type for fluid grid --\_

Grid
on
v Columns

Rows

5

Type

4 Stretch

Gutter

20

olor

[E. FFo000 = 10%

Width Margin

ie)

| Layout grid

x i: columns (auto)

Layer

© Pass through

Fill

FFFFFF 100%
Stroke
Effects

Export

Auto layout +
mse
7 BY
\*s 4 Layout grid 2

noo

LO}

100%

®

®

100%

®

The grid type defines the columns’ behavior: stretch is for the fluid

grid, and “center” is for the fixed grid.

Step 2. Set margins width: 32px (remember, you can choose any

other values).

Step 3. Define layout area. We skip this step for the fluid grid.

Step 4. The number of columns: 12.
Step 5. Gutter’s width: 20.

---

## Seite 208

MacBook Air - 4
|

Columns

Count Color

12 FCESED 100%

Type Width Margin

Stretch Au 32

Gutter

20

Desktop: 1280x832

Done! Save your grid as a style.

MacBook Air-4
t

i Layout grid +
Create new grid style x Grid styles ()

Q

[HI] N

| CO Browse libraries...

FFFFFF 100% eo =

Name CE: desktop Stroke Tr

Description
Effects +

Show more options Create style \ Export +

| think now you understood the logic.

As the screen size goes bigger, the margin value can increase:

GRIDS AND LAYOUTS 208

---

## Seite 209

Columns x

Count Color

12 fl Faaoss 11%
Type Width Margin
Stretch 80
Gutter

20

Desktop: 1920x1080

Fixed desktop grid

Now let’s create the fixed grid; we will use fixed numeric values for
gutters and columns. | recommend 74px wide columns, 32px wide

gutters.

Column - 74px

‘HI tH 4 a fH 4 a fH 4 tH tH

---

## Seite 210

Step 1. Choose an art-board size: 1280px.

Step 2. Set margins width. We skip this step for the fixed grid.
Step 3. Define layout area: 1240px; no strict rules here.

Step 4. The number of columns: 12.

Step 5. Guiter’s width: 32px.

Step 6. Let's calculate the width of the column—simple math.
Subtract total width of gutters (amount of gutters \* one gutter’s

width) from layout area, and divide it on number of columns.

gutters’ width = Igutter’s width \* amount of gutters

layout area - gutters’ width 1240 - (32\*11)

amount of columns 12

Done! That’s what we have:

Columns x
Count Color

12 FCES5ED 100%
Type Width Offset
Center 74

Gutter

32

Desktop: 11280x832, fixed grid

---

## Seite 211

Tablet grid

Do the same steps for the tablet. I'll just show some final results.

Columns

Count
Cm
Type

Stretch

Gutter

20

Color

ff Fa4os3 8%

Width Margin

Autc 32

Tablet: 834x1194, fluid grid

Columns

Count

Type

Stretch

Gutter

24

Color

IE Fados3 8%

Width Margin

32

Tablet: 768x1024, fluid grid

Columns

Count

Type

Center

Gutter

24

Color

Bh Faaos3

Width

96

Tablet: 834x1194, fixed grid

Columns

Count

Type

Center

Gutter

16

Color

IE Faaos3

Width

61

Tablet: 768x1024, fixed grid

8%

Offset

8%

Offset

---

## Seite 212

Mobile grid

Mobile screens are small, so you can simply set margins (the safe
area) and use the spacing system you already defined. That's
what | personally do. And for sure: no fixed grids for mobile, only

fluid.

Here are some examples of mobile grids:

<—> 1 l¢<————>
Flexible Flexible
YH 4
16px 20px

—HED CE- —GiDp cm -

---

## Seite 213

Complex layout grids

Different layouts require different types of grids.

Let's first see how the content can be distributed along the grid.

Full-width layout (one container)

In this case, content takes the area of all columns.

eecomt < oO @ budarina. com @ ©

fe Logic Home Services About —Contact Blog

Main content

Such layout is primarily used on landing pages.

---

## Seite 214

POS Sunny People Brand

BRAND SPONSORSHIPS.

Streamlined negotiations and
collaborations with influencers

Efficient and standardized Contract sent
negotiations and contracts

ted chat negotiat

Collaboration type

vod GE
Get started >

Progress

O » G)

Qo 8 All the content is posted.
Approve Milestone 2

Several containers layout

Here content is organized in 2 or 3 containers. Each container can
be distributed in 9-3/8-4 or 3-6-3/2-8-2 columns. The content

will scale along with the columns depending on the grid type.

---

## Seite 215

eee O < oO @ budarina.com @ ©

Sidebar Main content

@eceo@ MO < oO @ budarina.com @ @

Sidebar Main content Widgets

Two containers layout example:

G

G

---

## Seite 216

@eceo@e OM < Oo @ budarina.com @ ©

G

- ia)

Let's set up your Pick your interests
account nicely It will help us optimize your experience
Your details 6 Funny
4 Animals
Your details
® Mindblowing

Your details

) Time-Killers

Your details

© Sports

& Learn

@ Wanna know more?

But what if some content may scale to the screen width while over
stay fixed?

Then, the fixed-sidebar layout grid comes into place. The sidebar
width stays fixed across different breakpoints, while the main
content occupies the remaining area by either a fixed width

(example above) or fluid width container (example below).

eee MO < oO @ budarina.com @ © wh +

Sidebar .
Main content

---

## Seite 217

And for sure, layout can get even more complex:

PO: Sunny People < Allcampaigns

- Invite influencer |

@ Home

Flexible

Influencers

Campaign name G2 «<<

® Campaigns @
© April 10th 2022 - March 5th 2022
© Public
@& Messag
(©) Analytics Overview Invite Negotiate Fulfill
@® Payments Filter by Clear all
Discover Previously hired (100) Saved (70) Invited (9) Sort: Fit v

¢e—\_— |

| 1 Social medi: Fixed >
@& Settings (Q\ Samed. Flexible Instagram,

@x od #fashion x #beauty x @HM X @Armanirestautante x @Bingo x Clear all Fit score >
Rating >
Roberta & Bruno Contin © Message = ,
<> | % 4.0 Lifestyle Fashion Beauty
i © 124k Followers 89% Engagement $1,200 Avg post price Earnings >
xe

dt 100k Followers 65% Engagement $320 Avg video price

Gender >
y (3 Campaign fit: Matched 10 requirements
. Brand fit: Used your hashtags 6 times, Tagged you 4 times, Worked with 7... See more Age >
Location >
< Luna Matina . .
@iamthebrand 9) You invited Marianna Levi to your campaign! Undo

Follower count >

So sometimes, you can just rely on the spacing system instead.

Just be consistent.

GRIDS AND LAYOUTS 217

---

## Seite 218

Grid Tokens

Can we define our grids as tokens? — Implicitly, yes.

Tokens can be used to define breakpoints, grid gutters, column
widths and margins. We can whether use global spacing tokens, or

create alias tokens for greater specificity and easier use.

Using tokens for these design elements ensures consistent spacing
and alignment throughout the design, making updates and

maintenance easier and more efficient.

eee M < oO @ budarina.com @ @n +
fe Logic Home Services About Contact —\_Blog
$grid.fluid.margin.x|
“a
Global spacing ; ;
token Alias or
component
' specific token
Vv
$spacing.20

GRIDS AND LAYOUTS 218

---

## Seite 219

Key takeaways

- Grids are essential in digital design as they provide

structure, hierarchy, and rhythm to the layout.

- The grid is made up of columns and/or rows, with
  gutters separating the content and margins creating

white space around the content.

- Paddings are the space within an element's bounds; and
  layout regions are areas of the layout that contain the

content.

- Breakpoints are the "point" at which a website's content

and design adapt to the screen size and orientation.

- Grid can be fluid, fixed, and hybrid; and the layout can

be adaptive, responsive and strict.

- Responsive layout is a common practice in web design,
  it is fluid and adjust to any screen size and orientation;
  adaptive layout have fixed, set breakpoints and changes

entirely at them; while strict almost doesn’t change.

---

## Seite 220

Homework

List the most common responsive breakpoints. Create

desktop, tablet and mobile frames.

Describe and create the three types of grid behaviors:
fluid, fixed, and hybrid.

Find real examples of UI with fluid, fixed and hybrid grids

layout.

Create a complex layout grid for a dashboard.

Consider using a grid system for existing design to

enhance layout and usability.

Create a dashboard layout grid using a flexible hybrid

approach for improved responsiveness.

---

## Seite 221

Components,
patterns, templates

---

## Seite 222

What to consider
before creating any
component

So far, we have created the foundations of the design system:
spacing, grid, color, and typography systems. All those systems are

also reflected in the token database.

Now it’s time to create our main building blocks - components.

But before we begin, take into account some important points.

Qn
Table of contents
¢ Not so atomic approach. There is a hierarchy.
\*« Naming conventions

- Scalability

- Connecting tokens

« Documentation

---

## Seite 223

Not so atomic approach.
There is a hierarchy.

It's very important to see the structure and anatomy of the design,
to see what it actually consists of, and what are common
systematic patterns. Then it will be easier for you to understand

how to create such interfaces.

Explore >» Ideate >» Create

Before we get into details, let’s look at the interface | added below

and break it down into the smallest building blocks.

Codedamn Dashboard Q Search

© Expires in: 2d 23h

10% off PRO membership Get PRO >

Your final goal

Become a Front-end

developer
Get unlimited access to all materials just from £7/mo

D Playgrounds 5 Welcome, Marina “) To-do list

- 2500 + 5000
  = Watehanytessen
  nt: Bronze ¢ nt: Silver Xf
  Q Watch any lesson AyD
  Continue learning Watch any lesson aa

—m ose

a Javascript under the hood 2%
@ 1/14 lect @ 1/14 SC 68 o/s s Daily tip

You can add secondary cursors
(rendered thinner) with

—am (ose

Pa Javascript under the hood 12% A
~ @
& 4 lect G 1/14 lessons © 0/8 practice labs

1.1 Internet fundamentals. Internet and DNS

~ — -. BO.

Leaderboard

---

## Seite 224

Icons, typography, images, logo pieces. Those are our atoms -

parts of the style guide, the smallest indivisible elements.

Codedamn Dashboard Q |Search

© Expires in: 2d 23h Your final goal

Become a Front-end
developer

10% off PRO membership Get PRO >

Get unlimited access to all materials just from £7/mo

Playgrounds 5) Welcome, Marina © To-do list can
+2500 +5000
Watchanytesson
Build projects EEE rv) | { 20° }
(Current: Bronze Current: Silver [2oxplrece vec aaa
Q Watch any lesson 20 xP
ments 20xp received.
Continue learning Watch any lesson boxe
20xp received.
COURSE
Javascript under the hood 12%) |
ge fina lectures] |@ [1/14 lessons ||€]0/8 practice labs Daily tip
You can add secondary cursors
(rendered thinner) with
COURSE
Javascript under the hood 2s) (A
@llsettings Bhina lectures} |G) |1/14 lessons ||] 0/8 practice labs
Leaderboard View all
<J||Log out 1.1 Internet fundamentals. Internet and DNS
\_ — -. &B.

Compound logo, typography blocks, tags, badges, avatars,
notification bubble, progress bars, buttons, dropdown, sidebar
navigation elements, search input, progress circles, etc... Those are

our molecules - core components.

Notification icon + bubble; avatar + level progress; circle progress+
text block + badge; stacked navigation items, etc... Those are our
compound components: a combination of others, more simple

Ones:

---

## Seite 225

O Codedamn

FREE PLAN

@ Home
Career paths

& Courses

© Playgrounds

) Build projects

& Settings

©) Log out

O Codedamn

FREE PLAN

@ Home

Career paths

& Courses

© Playgrounds

) Build projects

Settings

©) Log out

Dashboard

© Expires in: 2d 23h

10% off PRO membership

Get unlimited access to all materials just from £7/mo

Q Search

come] [47] OG

Get PRO >

Continue learning

Dashboard

Your final goal

Become a Front-end

developer

Welcome, Marin: A - 5) elcome, Marina © To-do list Edit

- 2500 + 5000)
  Current: Bronze Current: Silver] 20xp received
  Q Watch any lesson 20 xP
  20xp received
  Watch any lesson aD
  20xp received
  COURSE
  Javascript under the hood = 12%
  & 1/14 lectures||@) 1/14 lessons | |@ 0/8 practice labs Daily tip
  You can add secondary cursors
  (rendered thinner) with
  COURSE
  Javascript under the hood = 12% A
  @ 1/14 lectures||@ 1/14 lessons || 0/8 practice labs
  Leaderboard View 2
  1.1 Internet fundamentals. Internet and DNS
  Q Search Courses v $2 | la g

© Expires in: 2d 23h

10% off PRO membership

Get unlimited access to all materials just from £7/mo

Get PRO >

Your final goal

Become a Front-end
developer

5. Welcome, Marina “) To-do list en

- 2500 +5000
  EEE Watelranytesson
  Current: Bronze Current: Silver @ eoxpieceled Lod
  Q Watch any lesson 20 xP
  20xp received.
  Continue learning Watch any lesson boxe
  20xp received
  —a COURSE
  Qa Javascript under the hood @ 2x)
  2 1/14 lectures G 1/14 lessons © 0/8 prac Daily tip
  You can add secondary cursors
  (rendered thinner) with
  [ ——--- } COURSE
  Qa Javascript under the hood @ 12%
  @ 1/14 lectures @ 1/14 lessons © 0/8 practice labs

  1.1 Internet fundamentals. Internet and DNS

Leaderboard View z

And CTA card, to-do list, final goal, course, progress cards, sidebar,

and top navigation... Those are also compound components - our

organisms.

---

## Seite 226

Codedamn Dashboard Q Search See) 42 & g

© Expires in: 2d 23h Your final goal

Become a Front-end

10% off PRO membership Get PRO >

Get unlimited access to all materials just from £7/mo

developer

5, ) Welcome, Marina © To-do list ai

- 2500 + 5000
  —_—_—\_ @ Werchervicsve @»)
  Current: Bronze Current: Silver 20xp received
  Watch any lesson 20XP
  20xp received
  Continue learning Watch any lesson 20 xP

20xp received

—\_ os

“Javascript under the hood Bs
@ 1/14 lectures @ 1/14 lessons © 0/8 practice labs Daily tip
You can add secondary cursors
(rendered thinner) with
| —
“Javascript under the hood ZN
@ 1/4 lectures @ 1/14 lessons © 0/8 practice labs
Leaderboard View all
1.1 Internet fundamentals. Internet and DNS

It doesn’t really matter how exactly you call those elements: if you
consider an icon a molecule instead of an atom; a button an atom
instead of a molecule, or if you want to divide everything more into
electrons and protons;) This is just a concept. Good one, but it has
some flaws. And if you will try to follow it strictly, you'll end up facing

some issues.

What you should understand instead: design elements are built
hierarchically, from simple ones to complex ones. As you
understand this, it will be easier for you to do any kind of work, not

just design.

See something complex? Break it down into smaller, simple things
and start from there. It will not only help you to organize
components in the library but will also eliminate procrastination

and frustration and will increase the chances of things being done.

---

## Seite 227

Naming conventions

Dont reinvent the wheel. Try to keep names as simple as possible
and rely on existing industry standards. For example, an input field
is almost always called "input"; you shouldn't call it a “form field"

because this is likely to be misleading.

Form field Input
Job title Job title

@ UI/UX designer @ UI/UX designer

How to find those standard names? Check design systems of other
platforms, and search on google. Here are some good resources

for you, where you can find the most standard names for

components:
The component gallery G

Up-to-date repository of interface components based on

examples from the world of design systems.

Open Ul G

The purpose of Open UI to the web platform is to allow web

developers to style and extend built-in web UI controls.

---

## Seite 228

Scalability

Try to follow the same logic when you create all your components;
they must be uniform in their structure and should be written in the

same technical language (when it comes to development).

Components should be created in a way that developer does not
need to re-write or to write complete refactor of it when there are

new requierments.

You should thought out well enough the design and the logic of a
component to handle possible future requirements that would
affect it in the future. It should be adaptable, responsive and meet

the changing business requirements.

Free assets @ Product licenses @
UI kit Personal Free
eBook Extended $99

---

## Seite 229

Connecting tokens

When you create components, use already created tokens/styles.
This will ensure consistency, scalability, and ease for future

modifications.

It may seem obvious, but that’s the common oversight, especially
for not experienced designers: they mat create all tokens/styles,
but don’t connect it to components, when it comes to actual

design processes.

Don’t complicate work for yourself.

radiobutton.small.active color.primary.bg

| © Commercial $52

padding.selector.medium -
color.primary.accent

---

## Seite 230

Documentation

Everything that we create must be documented; it will ensure
clarity in the team, as well as consistency and ease of use. It’s
especially important when the team is growing, as new people

come, documentation will make it easier for them to start.

Button

A control that triggers an action. Button labels should express what action will occur when the user interacts
with it.

Sizes

These sizes are standardized across form components.

Upload Upload

> Code Editor

Shapes

Icon-only buttons should include the svgOnly prop and an aria-label.

-— = m2 - FF FF

> Code Editor

---

## Seite 231

bf

Key takeaways

- Components are built hierarchically, starting with

atoms, progressing to organisms.

- Naming conventions should follow existing industry

standards and be simple and straightforward.

- Components should be created in a way that allows for

scalability and ease of modification.

- Tokens/styles should be connected to components to

ensure consistency and ease of modifications.

- Documentation is essential to ensure clarity,

consistency, and ease of use for the design system.

=

- Choose an interface, analyze it and break it down into

Homework

its smallest building blocks (atoms, molecules, and

organisms).

- Research standard UI components and naming

conventions; you will use them in your design system.

---

## Seite 232

Components

Creating a reusable component library enhances the product
development workflow by reducing design and tech debt and

speeding up the process.

You might not build a design system from the start, but you should
start piecing together the recurring Ul elements and start placing

them in a “components’ file.

Qn
Table of contents

- Core & compound components
- Component categories
  ¢ From where to start
- Creating components. Button. Method 1

- Creating components. Button. Method 2

- Testing components

---

## Seite 233

Core & compound components

As already mentioned, Ul is like a lego. We put all pieces together,
starting with simple ones and ending with massive platforms and

digital products.

Core components

Those are the smallest building blocks of the interface and can’t be

broken down into granular pieces without losing their meaning.

$i MB a) NH Add user

Compound components

If we properly create basic components, we can scale

exponentially.
Component + Component = Compound component

The more complete your base set of components, the easier it is to
create complex groups. When all the bricks are in place, they are

easy to manipulate.

---

## Seite 234

Add user

6GSsQG’ -:,

Component categories

Components can be organized into 4 general categories based on

their purpose: input, communication, navigation and containment.

Input components

Input components allow users to input information into the system

Example: checkboxes, radio buttons, dropdown lists, list boxes,

buttons, toggles, text fields, date field.

Resend code in 0:58 Resend the code

---

## Seite 235

Communication components

Communication components provide helpful information.
Examples: tooltips, progress bar, notifications, message boxes,

modal windows.

a Warning message! x x} Error message! x

Some description warning. Some description of error.

Navigation components

Navigation components help people move through the UI.

Examples: breadcrumb, slider, search field, pagination, slider, tags,

tabs, icons, navigation bar.

My sessions Q Search for a session..

QO Favourite (3) Sort: Last viewed > ete S

---

## Seite 236

Containment components

Containment components hold information and actions —
including other components like buttons, menus, or chips.
Examples: button sheet, card, dialog, divider, list, side sheet,

accordion.

From where to start

Start with a button. Though it may seem the easiest, it includes
almost all elements of the visual language: color, typography,
spacing, icons, accessibility, interactive states, animation, and

principles and rules.

Typography

Button -------- Accesibility

Spacin system

---

## Seite 237

And as you think this component through (its structure, sizes,
interactive states: hover, focus, etc.), you can turn your decisions

into tokens and apply the same logic to other components.

O Button © Button © Button

Small - 32px Medium - 48 px Large - 56px

Y Default ) f Hover ] Focused Pressed Disabled

Creating components. Button.
Method 1

If you worked in figma, you know that it allows you to nest one
component inside the over. | will show you how to build a
component using master and style components; it makes it easy
to apply changes, especially when you have a vast system. This

method has some cons, so it’s up to you to follow it or not.

As an example - | will create a button component.

---

## Seite 238

Master components

These are a skeleton of the component which can be used to
change the foundational properties like padding, font properties,

spacing, layout.

So when creating a master component, we define all elements that

can be inside, their size variations and spacing.

(12 Im 14 px 16) @ @ ©
1
O Button O © Button ‘CE

t Small - 32px ] Medium - 48 px Large - 56px

© Button ‘O

Here you can apply component properties, that allows you to
control things like:

- Layers you can hide or show

¢ Whether an instance can be swapped

- Which text strings can be changed

Figma component properties G

Click on the link to learn more about component properties.

---

## Seite 239

® Pro Tip: add a period [.] or underscore [_] in the front of the
component's name in the layers panel, to hide it from others in the
assets panel (because you don't really want anyone to use or
change your master components) and to prevent Figma from

publishing it.

So you would call your component: “.button_master”

% button_master % .button_master
Style components

Style components are a skin of branding over master components.
Here you should change colors, and add styling on the master

components.

} .button_master &% .button_style & .button_style

Copy your master components, create multiple components, and

call it “.button_style”

---

## Seite 240

¢% .button_style

Edit variant property x

Name size

Create component NK
Values

Create multiple components

large

Create component set
small

medium

Add size variants (small, medium, large) & type variants (primary,

secondary, distractive).

O Button O © Button © ©) Button ©)

---

## Seite 241

Final component

Now we will create final buttons. Copy your style components and
create new components - “button”.

For all sizes and types create states (default, hover, focused,
pressed, disabled) and icon variations (icon only, left, right, no

icon).

on
= — = fo} OCR I EED@ I Barton | ©

Now you have a nested button component. To change a size -
change your master component. To change the style - change
your style component (though it won't work that well since we
changed the fill property for hover, pressed, and disabled states, so
you'll have to change those parameters manually).

So you can just skip style components step.

And let’s consider another method.

---

## Seite 242

Creating components. Button.
Method 2

We will create a master component, but a bit different, and after

that create variants.

Master components

Create buttons of different sizes (small, medium, large), and add

icons variants (false, right, left, only).

By the way, you may not need that many sizes, or you may not

need buttons with icons, depending on your needs.

4 \_MasterButton

Button text >
Button text >

cmc ee ee ee ee ee ee we oe ee

Ce ee i ee ee ee ee ee

L

---

## Seite 243

Final component. Method 2.1

Duplicate small, medium, and large buttons with text and create

components set.

## ¢ Button

|

|

|

|

L

Button text > Button text > Button text —>

eee eee,

Create type (primary, secondary, etc..), states(default, hover,
focused, etc...), and dark/light mode variants. | added just some, for

educational purposes.

Button

Button text >

Button text >

Button text >

Button text — Button text >

Button text > Button text > Button text > Button text > Button text > Button text >

Button text > Button text > Button text > Button text > Button text > Button text >

Button text > Button text > Button text >

Button text > Button text > Button text >

As you can see, | didn’t create styles for all icon types. Instead, | will

use nested properties.

---

## Seite 244

Properties + Properties

® Type Primary, Second...

® State Default, Hover, F... Wenfera

@ Dark mode On, Off Boolean
Instance swap

@ Size Large, Base, Small

Text

Nested instances

So now, as | copy a component and change icon presence. This

way | decreased amount of variants in 3 times.

©} Button v %

> Type Primary
> State Default
> Dark mode
> Button text > . as
> \_MasterButton
> Button text Icon Right

Size Medium

---

## Seite 245

Final component. Method 2.2

| can go one step forward and delete size variants, keeping them

only in the master component.

‘P Pro tip: make sure that your master components are set to
“Hug”, otherwise this won't work. This also means you define

component height by setting paddings, not the height itself.

\_MasterButton2
cr

=> Frame

Button text Button text x 171 Y 69

i ------------------- ae Button text >
. . Button text >

> < Hug X Hug

J Clip content

And here would appear some values

Auto layout =
that may not be part of your
spacing system. ‘a I
IT 8
| wouldn't worry since we rely here hee a a
on the button height, not the :
padding value. le ed

By the way, here the spacing principles come in place: element
(strict element sizing) or content first (strict internal padding).

When working with buttons, inputs, etc - it’s always “element first”

And here is what we have:

---

## Seite 246

Button2
c
Button text > Button text > Button text >

Button text > Button text > Button text >

Button text > Button text > Button text >

For sure, in documentation, for developers and the team, we need
to clarify how this works and what components and variants we
have. | use the second method and find it easier to add some

changes. Though you may face some issues here as well.

You can keep it all simple and go the way you used to. However,
the right question here would be what is simpler and what works

best for your system.

---

## Seite 247

Testing components

As you create components in Figma, test them! It is the last step of
asset production before you release it. It will ensure components

are built well.

What you should check:

@ Are layers and properties named correctly?

@ Does each configuration produce the expected visual outcome?
@ Is color properly applied?

@ Do elements flow text correctly when the component is resized?

Make sure that there is the ease of composition, content,
discoverability, and manipulation:

@ Can! configure component properties and use elements easily?
@ Can! add text and image content easily?

@ Can | find component features and elements?

@ Can | easily customize and override layers, properties,

subcomponents, and styles?

Play with your components, change overrides, and check if it all

works well.
For example, | described two methods of creating a button. It was a

trial and error process; in the last method, | initially had issues: the

size of a button didn’t change properly.

COMPONENTS 247

---

## Seite 248

Master component height set to fix. In final
component size of a button doesn’t change properly.

Button text > Button text —>

Only after testing | realized that | must set the height property of a

master component to “hug.”

After testing and fixing the issues.

Button text > Button text —->

Only after testing | realized that | must set the height property of a

master component to “hug.”

COMPONENTS 248

---

## Seite 249

Icon issues

Another common issue happens when you swap icon instances in

a component and lose all overrides: color, stroke weight...

Add to cart &

Let’s consider a real practical example.

1. Choose an icon.

2. Change the size.

3. Change the stroke.

4. Click Shift+A and create a button.
5. Change its color.

6. Click Alt+Ctrl+K and create a component.

ow oo & BP B

Now copy the component and swap the icon. There is 50% chance

it won't work as needed.

COMPONENTS 249

---

## Seite 250

© ©
°o )

The issue is in the layers name. Figma is looking for consistent

layers’ name structure and converts all properties accordingly.

% ~vuesax/linear/bag-tick

bag-tick / linear

container box

In the best scenario, you should use icons modified for Figma. If not,
and you want to use this specific icons library, set up clear naming

manually.

Select all icon elements (except the container box) and click
CTRL+E. Give them one name. | kept it as is: vector and gave the
name to the container box. Though you can delete the container

box, it was needed only for icon creators.

---

## Seite 251

Same works for duotone/bold/bulk icons. Just give clear names to

each group (stroke versus fill). Then all changes will be inherited

properly.

icy)

bag-tick / linear
container box

Icon

at

bag-tick / bold

container box

Icon

bag-tick / twotone

container box

Icon

Fill

bag-tick / bulk

container box

Icon

Fill

---

## Seite 252

Key takeaways

- Creating a reusable component library speeds up the
  product development process, reduces design and
  technical debt, and allows designers focus more on

solving problems instead of moving pixels.

- The Ul can be broken down into core and compound
  components, with core components being the smallest
  building blocks and compound components created

from combining core components.

- Components can be organized into categories based on
  their purpose: input, navigation, communication and

contentment.

- Start creating component library from a button. This
  way you will think through structure for most of other
  components and most of the elements of the visual

language.

- When creating a component consider variations: size (ex:
  different screen sizes), type(ex: primary, secondary, etc)

and state (ex: hover, focused, pressed, etc)

- Don't forget to test your components.

---

## Seite 253

=

- Choose a method for creating the components (master

Homework

& style component or master component with variants,

or just a regular method that you followed before).

- Create a button component following the chosen

method.

- Following the same logic, create some other

components: avatar, badge, input, card...

- Goto Component gallery and check what components

exist out there.

- Organize the components into categories (Input,
  containment, navigation or communication). Check how
  Material Design (3) organize their components.

- Test your components: change icons, size, states, etc.

- Document your components in Figma, I'll attach Figma

files with examples, so you ca inspire.

---

## Seite 254

Patterns & templates

UI design patterns & templates are important aspects of user

interface design.

Patterns provide visual strategies for solving common UI design
problems and can take the form of components or abstract
guidelines. Templates, on the other hand, focus on the underlying
content structure of a page, showing how components work

together.

Q

Table of contents

¢ What is a Ul design pattern?

- Common UI design patterns & how to apply them.

- How to create UI design patterns

- Where to find existing UI design pattern libraries.

- Dark design patterns.

- Templates

- How to create templates

* Pages

---

## Seite 255

Whatis a pattern?

In Part 1, the terms confusion section, we already covered that
patterns aren't just some components, not just common features
that can be copy-pasted into an interface; they're visual strategies

for quickly and efficiently solving common UI design problems.

They can perform as a set of components but don’t have to; they
can be more abstract or high-level guidelines that answer the

question: "How do we do ?".

rx) Error happened!

«me Omg, but what do we do
Do something! when error happens?

Common UI patterns &
how to apply them

Keep in mind patterns are more than just components. So the
loading pattern is not just the loading form, okay?) In Figma, you
may keep just components; in the documentation part, you will

define guidelines, behavior, usage rules, anatomy, alternatives, etc.

So let’s consider some examples.

---

## Seite 256

Loading patterns

Loading patterns help guide people and understand what to
expect There are different elements that can show the loading

experience, let’s consider just 2:

Loading skeleton: a collection of loading placeholders that display
a Ul preview to visually communicate that content is in the process

of loading.

Loading spinner: an animated element that indicates loading is in

Process.

~

Loading...

? Note: you don’t have to use just one type of component for all
cases. Create alternative decisions for the cases where the regular

pattern looks off.

For example, using a spinner for tables is not a good idea, but it’s a

good fit for fast processes that take less than 300ms.

PATTERNS & TEMPLATES 256

---

## Seite 257

So the pattern can be accomplished with different components for
different scenarios, but they must be based on the same logic. The
logic should be a reflection of what is already used in most cases

(for example, we use spinner in most cases).

And we need to define clear guidelines. Here is an example:

First rule: The primary indicator of loading is a spinning spinner. We

use it almost everywhere.

Second rule: For more than 1 element loading simultaneously that

requires an indicator use a loading skeleton.

Carbon DS Loading Pattern G

Learn more about loading patterns.

Empty state patterns

Empty states are moments in an app when there is no data to
display to the user. The most basic empty state displays a non-

interactive image and a text tagline.

---

## Seite 258

Campaigns ar

-) 8

No brand chats, yet!

Have a brand you want to work with?
Invite them to collaborate effortlessly here

No campaigns yet

Invite brands to collaborate with Q Discover

and build your profile

There are several situations where you can provide users with
alternatives to truly empty states. And that’s also a pattern that
you should define. Alternatives to empty states include starter

content, educational content, and best match.

For example, consider providing starter content when users land on

the home page for the first time, allowing users to explore your app

immediately.

Press Enter to continue with an empty page, or pick a template (7 to select)

[5 Empty page with icon
‘Empty page
@& Templates
Import
DATABASE
& Table

1 Board

Image source: Notion.so

PATTERNS & TEMPLATES

258

---

## Seite 259

How to create UI design patterns

UI design patterns can’t be plugged directly into an interface. We

need to tailor them to fit a particular scenario.

1. Start by defining the problem you want to solve.

(For example, how to display error states?)

2. With a clear problem, head to your favorite UI design pattern
   library. Click on the category that best fits your need. Check out alll
   the different examples listed. How is the pattern meant to be used?
   How have other designers used it? What can you learn from it? Pay
   attention to the different elements used and how they are

structured.

3. Make an audit of your platform/product/designs. Define where

this problem appears/ where you need this pattern

4. Leverage the knowledge shared about this Ul design pattern and

create your own solution.

? Note: For patterns, it’s okay if they are implemented just on the
design level and documented. In comparison, components must

be implemented into the code.

---

## Seite 260

Where to find existing UI design
pattern libraries

Here are some resources for you:

Ui Patterns G

Library with very detailed information about UI design

patterns; particularly beneficial to everyone new to design!

Ul Garage G

Daily handpicked UI inspiration & patterns

Mobbin G

100K+ fully searchable mobile and web screenshots.

Design vault G

Ul patterns & design inspiration from real products

---

## Seite 261

Dark design patterns

Dark UX/UI design patterns trick users into unknowingly performing
a specific task. Some dark patterns are less harmful, such as
tricking users into signing up for e-mails. Others hide key
information, meaning users get locked into memberships or direct
debits.

Dark patterns are a lot more common than you might think.
Nevertheless, they're generally frowned upon and-—if misused—can
destroy trust between a company and its users. Ul design relies
heavily on empathy and creating an interface that’s enjoyable to

use—not frustrating!

& You are the 100K visitor!

eens e------ You mean, | can’t say no????

Yes Claim

---

## Seite 262

Templates

Templates focus on the page’s underlying content structure
(rather than the page’s final content), placing components into a

layout and demonstrating how they look and function together.

They are the most advanced level for design systems and help to

account for a variety of dynamic content.

You can create good experiences without knowing the
content. What you can't do is create good experiences
without knowing your content structure.

- Mark Boulton

Templates benefits

They are very beneficial, even if created only on a design level (not
implemented into code). Moreover, it’s better to first create them
only on a design level, test, and only after gradually starting

coding.

Templates help to:
e@ Assemble interfaces with incredible speed
@ Make interface creation more accessible to designers

@ Save designers’ time on inventing layouts

---

## Seite 263

How to create templates

1. Audit the design.

Analyze which pages are mostly used?

2. Define high-level templates.
   You don't need to create templates for each edge case. Instead,
   create commonly used ones. And it can be just a wireframe or

skeleton.

3. Create more detailed, typical templates.

They can consist of tables, accordions, lists, graphs, forms or text

blocks. Or that can be some typical pages: dashboards, settings...

For example, | often create pages with some steps and options. So |

created a template for that.

---

## Seite 264

as eoom< c @ budarina.com ©nv +O

Step name

Some steps Step name
Description
option Your detaits
© Opti © Option
, Your detaits
© Opti ,
Option © Option
© Option a | © option
Your details
© Option © Option
© Option | © Option
© Option © option

@ Wanna know more?

@ Wanna know more?

Pages

Pages are specific instances of templates that show what a UI

looks like with real representative content in place.

> coo < © @ budarina.com ©h+O

Pick your interests

Let's set up your Pick your interests
Teathelp us optimize your experience account nicely It wil help us optimize your experience
r

© Fanny Y Your details © Funny

4 Animals @ Animals
Q Your detaits

® Mindblowing ly Mindblowing a | 3) Your detaits

) Time-Killers ) Time-kKillers

Your details

@ Sports © Sports

Learn
< @ Learn

© Wanna know more?

© Wanna know more?

---

## Seite 265

9:41

e —

Pick your plan

Let's get started
Free

Personal

‘Commersiat

@ Wanna know more?

so

$25

$46

9:41

e

How you plan
to use our app?

Choose one option for

= Personat

& Business

9:41 ae

e

Choose your interests

sonal r Jat

= Personat

& Business

Mindbtowing

) Time-Killers

@ Learn

9:41

€

How you plan Choose your interests
to use our app? person
ne oF 7
Personal
Personal
® Business
@ Business

> Mindblowing

@ Time-kitlers

Sports

® Learn

---

## Seite 266

x

Key takeaways

- Patterns provide visual strategies for solving common
  UI design problems. They take the form of components or

abstract guidelines.

- Dark Ul patterns should be avoided as they can harm

the relationship between a company and its users.

- For patterns and templates, it’s okay if they are

implemented just on the design level.

- Tocreate a pattern, define the problem first, do research,

make an audit, leverage the knowledge, and then create.

- Templates focus on the page’s underlying content

structure, while pages have the content in place.

---

## Seite 267

=

- Research different UI design patterns and find examples

Homework

of their usage.

- Evaluate your current platform or product and identify
  areas where a specific Ul design pattern could be

applied. Create a pattern.

- Study the content structure of your platform or product

and create a template to unify the design.

- Explore dark UI patterns and think how you can avoid

them in your designs.

---

## Seite 268

| PARTS
Documentation

---

## Seite 269

Documentation

A design system's documentation is surely one of its foundational
elements; without it, you would only have a component library, and

as we all know, a design system is much more than that.

The documentation of the design system is crucial to its adoption
because the product team will only be able to use it properly if it’s

well understood, which defines its success and longevity.
Qn
Table of contents

- Why do we need documentation?
- Documentation types and tools

¢ Structure & what should be inside

---

## Seite 270

Why do we need
documentation?

@ Documentation is our single source of truth, meaning we have a
place where all the information is regularly updated.

@ Any user of the system can refer to it when they have some
common questions, which saves a lot of time and ensures clarity
in the team.

@ Documentation helps design teams combine, present, consume
and execute usage guidelines. This ultimately helps designers
and developers to deliver a more predictable and consistent Ul.

@ Documentation helps developers and designers find, learn, and
use components correctly.

@ Wecan't place everything in Figma/Sketch, especially some
detailed guidelines, as well as some technical points and code
snippets... (I mean, I’m sure you can anything, but | don’t

recommend it:) that’s where the documentation comes in place.

Documentation types and tools

The type of documentation and, therefore, tools you should choose
will depend on your stage, your resources, and your business

needs.

---

## Seite 271

Documentation types and tools

Generated

Figma cz Zeroheight cz You own website
Confluence Specify
Notion Storybook
Google Doc Gitbook
Wiki Radius

Static

That's usually where everyone starts from: some static information,
rules, and guidelines that are documented in Figma, Confluence,
Notion, or Google Docs. It can be an excellent temporary decision

when you don’t have enough resources.

For this type of documentation, | recommend using Figma (or
Confluence) since it allows designers and other team members to
include some changes, and it’s more “live” than just a regular

Google Doc.

Pros: suitable for beginning, it can be easily created by one
designer, does not require any technical knowledge.
Cons: bad for long-term, hard to scale and maintain, require

manual updates, therefore quickly lose relevance.

---

## Seite 272

Figma Confluence (D Trello

Static type Static type Static type
» Google Docs Notion

Static type Static type

Generated

Here we generate our documentation from the repository / Figma
library, using secondary platforms, such as Zero height, Storybook,
Radius, etc. This way, you won't have to create a documentation

website from scratch.

Pros: full-fledged; doesn’t require a lot of technical skills and can
be created by a designer with some guidance and support from
the developer.

Cons: has its limitations as any product or framework; security

policy issues.

>

Zeroheight GithubPages {} Knapsack
Level 2 Level 1 Level 2

K&S Specif Storybook Supernova
ow 3s Level 2 Level 2 Level 2

---

## Seite 273

Custom

In this case, you create a website that fits your own needs. It can

also be used for security reasons. Almost all big companies have

their custom website for documentation.

Pros: allows to implement any requirements that third-party

platforms don’t; secure.

Cons: requires resources and budget.

Q- Search... /

Introduction
Color

Grid

Icons

Playground

Brands
Vercel
Nextjs

Turbo

Components \_ Internal
Avatar

Badge

Button

Calendar

Capacity

Checkbox

Image source: Vercel.

Conclusion

Geist

Vercel design system for building consistent web experiences.

AVercel

Assets

Learn how to work with our
brand assets.

abcdefghijkimnopc
@
Components Icons

Building blocks for React Icon set tailored for developer
applications. tools.

If you're just starting and don’t have resources, try to gather it all in

Figma or use Github Pages and look towards such platforms as

Zero-height.

---

## Seite 274

Structure &
what should be inside

Below is a list of sections that | believe should be in the design
system documentation, but it’s not final and should depend on

your business needs.

What should be inside

Get started Design principles

Extra

Get started section

We need some general instruction on how to use the design

system. This section may include:

@ Overview / About us
@ How to use design system
@ Contributions

@ Introduction for designers / developers

---

## Seite 275

What's Material? Using Material

Learn how Material enables beautiful product design at Google scale Get to know Material.io and our top resources

Design Develop

Start applying color, type, adaptive design patterns, and more Developer resources include code for Android, Flutter, and the Web

Image source: Material Design

What's new

It should show all of the items that have been added or updated in

the design system. It can include:

@ Changelog
@ Monthly updates
@ Roadmap

@ News and launches

DOCUMENTATION 275

---

## Seite 276

Nord.

What's New

Q Search

Home
Getting Started

This section is updated regularly with new content to help you stay up to

Changelog date with the latest roadmap updates, releases, and articles from the
Monthly Updates Nord Design Systems team.
Roadmap
Guidelines
Design Tokens Monthly updates >
components nordhealth.design/updates/
Templates
ie Asani Latest releases (changelog) >
Nordicons nordhealth.design/changelog/
Themes
Contributing GD
Downloads Our roadmap >

nordhealth.design/roadmap/
FAQ

Image source: Nord.

In the changelog it’s good to highlight the type of change: markup,
style, script, or spec (guidelines, instructions, etc.). And group
changes by type: enhancements, new items, fixes, and other

changes.

v1.0.1 ~ February 15, 2016 Download Release 4

What's New

t css @ New Component: Rich Text Editor

& Cc» q@ @ New Component: Date Input Field. Uses the momentijs library to do smart parsing of
date input values and localization.

& aa New Page Type: Community Home.

t spec ) cs» New Page Type: Community Category.

Enhancements

& : Updated Guidelines: Accessibility Requirements updated to no longer recommend
HTMLS5 Document Outline compliance since there are no browser or screen reader

implementations that use it.

---

## Seite 277

Design principles

It helps to synchronize the work on the product for all members of

the team (not only designers and developers).

AN Spectrum

Principles

Q Search

Spectrum
Principles
What's new

Foundation
Design tokens

Platform scale

Theming
Color
Typography
Object styles

Rational Human Focused
Motion
5 Spectrum is based on real-world situations. Spectrum places customer needs first. It's Spectrum strives to deliver what's needed,

tates

Every component, pattern, and principle is deeply committed to a high standard of when it's needed. No unnecessary decoration

Iconography informed by research and thoughtful testing. accessibility, honesty, and respect for user or irrelevant content.
attention.

Illustration

Image source: Adobe Spectrum

Foundations / Visual language / Style guide

Let’s face it: People are visual creatures. This part should include:

@ Typography @ Data visualization
@ Colors @ Accessibility

@ Spacing system @ Animation / motion
@ Grid @ Elevation

@ Layout @ Shape / Roundness
@ iconography

Design principles and tokens can also be part of the foundations.

DOCUMENTATION 277

---

## Seite 278

Color Elevation

Color is used to express style and communicate meaning. With dynamic Elevation is the relative distance between two surfaces along the z-axis. All
color, Material puts personal color preferences and individual needs at the surfaces and components have elevation values.
forefront of systematic color application.

Image source: Material Design

Tokens

You may have a dedicated ‘Design Tokens’ page that includes
information about design tokens in general or put it inside the
“Styles/Style guide/Visual language,” or ‘Foundation’ sections, as
well as have information about specific tokens in the respective

section: color, typography, etc.

Doing both can be helpful because they solve different problems.
Having style pages like ‘Color’ lets you add more content and
guidance around color usage. While having a dedicated page can
help educate users about what design tokens are in general and

how to use them.

Image source: Material Design

DOCUMENTATION 278

---

## Seite 279

Components

? Note: in the documentation you should use live components, not
images. While Google may have 40 people team just to update
images on their design system website, you may not have such

resources.

A ae Input
Retrieve text input from a user.

Q Search.. /

Description

Drawer

Placeholder.
Entity

Error

Feedback

Fieldset

File Tree

Input Sizes

Keyboard Input

Small 7
Loading Dots Default Large

Menu

> Code Editor
> Modal

Image source: Vercel.

What should/can be on each component documentation page?

Consider who the documentation is primarily for: designers,

developers, managers, QA, or researchers. Do you have separate
documentation for Devs and designers? Or are they going to use
one source of information? There is a lot to think of, especially for

big companies. But let’s consider some common elements.

1. Component description.
   Describe in 1-2 sentences what this component does, what it’s

function. It should help users understand if they need it or not.

DOCUMENTATION 279

---

## Seite 280

Buttons

Buttons help people initiate actions, from sending an
email, to sharing a document, to liking a post.

Image source: Material Design

2. Component representation.

So Duri

@so-duri

Thanks for doing the grocery shopping! I'll do
it next week.

$159.32

Show your live component (for example, you can insert Figma

preview, or use component playground with actual coded

elements - exactly those used in the product.).Show all possible

variants, sizes, states, types.

Figma
PRIMARY PRIMARY SUBTLE
CRITICAL CRITICAL SUBTLE

Button Button

33 Documentation frames Edited 2 months ago

Image source: Orbit Kiwi

SECONDARY

Button

WHITE

Button

---

## Seite 281

Component playground

smallMobile (320px)

Code editor v Playground « ei (0 (©) G

Button

circled ep fullwidth @
disabled ep loading -p

size normal v type primary v

Image source: Orbit Kiwi

3. Usage guidelines/ use cases
   Provide clear instructions and tips or maybe examples on how

to use the component.

» Usage

Buttons communicate actions that users
can take. They are typically placed
throughout your UI, in places like:

x Dialogs

- Modal windows
  a ReqaS Chat with Thea and So

One person has joined

- Cards

x Toolbars () Present

Example video-calling screen with 2 buttons

Image source: Material Design

DOCUMENTATION

281

---

## Seite 282

4. Do’s and Don’ts

Make it clear what exactly should be done with the component;
how it should and should not be used. Thos instructions can be
plain text or accompanied by illustrations. They can be part of

usage guidelines.

Usage of the component

v Use x Don't use

Y\_ To display several details about a single idea like a x When you have many actions at once—use
transfer at an airport. a button link.

Y Touse common visual cues (icons and colors) to x You want to offer a less important action—
help users scan the details. use a button link.

x To make text inside paragraphs or lists
actionable—use a text link.

x So users can sign in using a social service—

use a SocialButton.

Image source: Orbit Kiwi

Pork bao buns $7.95 Pork bao buns 87.95 Pork bao buns 87.95
Made with barbeque-flavored sha siu pork Made with barbeque-flavored sha siu pork Made with barbeque-flavored sha siu pork
and steamed to perfection, these pork and steamed to perfection, these pork and steamed to perfection, these pork
buns are our most popular menu item buns are our most popular menu item buns are our most popular menu item.

Add to order Add to order

A button container’s width is dynamically set A button container’s width shouldn’t be Button container width can be set according
to fit its label text. narrower than its label text. to the responsive layout grid.

Image source: Material Design

---

## Seite 283

5. Code snippets and technical instructions
   Provide instructions for developers on how technically

implement the component.

Upload Upload Upload Upload Upload

\ Code Editor C 2

<Container direction={['column', ‘row', ‘row’ |}
<Container left>
<Button type="secondary"
Upload
</Button>
</Container>
<Container left>
<Button>
Upload

Image source: Vercel

If you want to learn more about component documentation, |
recommend you explore different design systems and read the

article below

Components documentation G

Serve a System's Audiences with Well-Architected Content

---

## Seite 284

x

Key takeaways

- Design system documentation is a crucial as it helps

ensure proper understanding and use of the system.

- It serves as a single source of truth and can be used by

all users of the system for clarity.

- Documentation can come in different forms, such as
  static information in tools like Figma or Confluence,
  generated documentation using platforms like Specify or

Storybook, or custom websites tailored to specific needs.

- The structure of the documentation should depend on

the business needs.

- Common elements of the documentation: "Get Started’,
  "What's New", Foundations (Design principles, Style guide,
  Tokens, Accessibility), Components (Guidelines, Do’s and

Don'ts, Code snippets).

---

## Seite 285

=

- Choose the type of documentation that best suits your

Homework

business needs and resources; accordingly choose a

tool.

- Start creating the documentation by listing out the

sections you would like to include. You can research and

inspire from other companies.

- Write a brief description of each component that will be
  included in the design system. Don't hesitate to explore

descriptions of other companies.

- Consider who is the primary audience for the

documentation and tailor the information accordingly.

---

## Seite 286

Implementation
& scaling

---

## Seite 287

Adopt, adapt or
create

So far, we have been talking about creating the design system. But

it’s not the only way.

Depending on budget and needs, companies can select one of
three approaches to design systems: adopt an existing system in
its entirety, adapt an existing system to the company’s needs, or

create an entirely new one.

Q
Table of contents
¢ Adopt. What it is about and how to do it.
¢ Adapt. What it is about and how to do it.

¢ Create. What it is about and how to do it.

¢ Which approach to choose?

---

## Seite 288

Adopt

That's the “easiest” approach because you don’t change anything

and just go with what you have.

For example, many start-ups use ready-to-go component libraries
such as Tailwind. Especially when there is no designer in a team
(yeah, that happens as well, it shouldn't surprise you), but is better
if there is someone who understands how to use all these elements
because just having a set of components and elements is not

enough.

Good to go,
Let’s use this
5% library as is
"a Okay, let’s start
e-------
from here

ys

How to adopt a design system.

Adopting an existing design system can be a straightforward
process, but it does require some planning and preparation to

ensure a successful implementation.

Here are some steps you can take:

---

## Seite 289

1. Research different available design systems and evaluate their
   suitability for your project. Look for design systems that align with

your design style and workflow.

2. Understand the system: components, design principles, and
   guidelines that you plan to adopt. Familiarize yourself with the

system's structure, layout, and code.

3. Audit your current design and identify areas that need to be

updated to align with the new design system.

4. Create a plan to implement the new design system. This plan
   should include a timeline, a list of components that need to be

updated, and any additional resources that will be required. 5. Train your team on the new design system and ensure that
everyone is familiar with the design principles, guidelines, and
components.

6. Implement the system following the plan you created.

7. Test and validate new design system to ensure that it meets the

needs of your users and stakeholders.

8. Monitor and maintain; make any necessary adjustments to

keep it up to date with the latest design trends and best practices.

---

## Seite 290

Even though it may seem to be the easiest choice, it's important to
remember that adopting an existing design system can be time-
consuming and resource-intensive, so it's important to plan
accordingly. It's also important to work with a team of designers,
developers, and stakeholders throughout the process to ensure

that the design system meets the needs of all stakeholders.

Adapt.

Using the same Tailwind Library, we can involve brand/visual
designers (UI/UX) so that they help customize and change the

system to business needs.

\tailwind@ = = = ~———\_——\_\_ Components Templates Documentation Q

Can we customize
it and increase
brand differentiation?

Please align this
system to our branding

Build your next idea
even faster.

How to adapt a design system.

When customizing an existing design system, there are several key

elements that you can change to make it fit your specific needs:

---

## Seite 291

Branding: adjust the color palette, typography, and imagery to

align with your brand and make the design system your own.

Components: modify the existing Ul components, such as buttons,
forms, and navigation menus, to suit the needs of your project. This
may include adjusting the components layout, functionality, and

appearance.

Design guidelines: adjust the design principles and guidelines to

align with your design style and workflow.

Accessibility: ensure that the design system is accessible to alll

users by implementing accessibility standards.

Responsiveness: ensure that the design system is responsive and

adapts to different screen sizes and devices.

Interaction: add or modify the interactions, animations, and

micro-interactions to improve the user experience.

? Note: Test and validate the design system before implementing
it in your project to make sure it meets the needs of your users and

stakeholders.
? Note: It's important to keep in mind that customization of an

existing design system should be done in a strategic and

thoughtful way so as not to compromise on the usability,

ADOPT, ADAPT OR CREATE 291

---

## Seite 292

scalability, and maintainability of the system. You should also

consider the scope of the project and the available resources.

Create.

Well, that’s what we have been discussing so far in this ebook :)

Case A. Building design system from the
beginning.

In this case, we work on the design system from the beginning in
parallel with the main design work; our system doesn’t have to be
complete at this stage, but we CONSCIOUSLY should work on

piecing all elements together.

---

## Seite 293

We set up a style guide, building bit by bot component library and
adding some descriptions and documentation elements when
possible. That’s where we rely on static documentation or use

Figma only.

Case B. Building a design system when there is
a product already.

In this scenario, we already have a product but without any system
in place: no components, no style guide, no consistency, and no

Processes.

In this case, in addition to all processes, we must run an audit,
analyze existing product and all existing processes; and then set
priorities and define the roadmap on what should o be changed/

fixed/implemented first.

How to create a design system. Steps overview.

Creating a design system can be a complex and time-consuming
process, but it is an important step in improving the efficiency and
quality of your UI design work. Here are some general steps you

can take to create a design system:

1. Make an audit.
   Take inventory of what you have today; determine the current

state.

---

## Seite 294

2. Identify user problems and needs (users of the design system)

3. Define your design system's purpose and goals.

It's important to have a clear understanding of why youre creating

a design system and what you want to achieve with it. This will help
you to stay focused and ensure that your design system is aligned

with your overall design strategy.

4. Research and gather inspiration:
   Research other design systems, both within your industry and
   outside of it, to get an idea of what's possible and to gather

inspiration for your own design system.

5. Get your company onboard with your Design System

Find partners before you start building a design system.
Communicate the need; explain the inconsistencies that you
discovered from your inventory building and how they adversely

affect the user experience.

The people around you should understand the idea of the design

system and share your values. 6. Create a long-term strategy and a short-term plan

7. Present concepts to the decision maker (manager/owner)
   Make sure you can clearly answer the question “why do we need
   it?” and be ready to prove the usefulness of the design system in

your situation.

---

## Seite 295

Demonstrate practical examples of design system implementation

from other companies and how it helped them.

8. Build a multidisciplinary team

You need a team to implement and manage a design system
through the entire product design cycle. Most design systems
teams need designers and front-end developers. Start by
identifying the skill sets you need and then decide on the people

who have them.

9. Prepare the first release.
   The first release may include design principles, philosophy, pillars
   of the visual language (a color pallet, a typography system, a

spacing system), and baseline components.

8. Create subsequent iterations roadmap

Don't try to implement the whole system everywhere; it is too
difficult. Move iteratively, covering more and more new areas until
you come to full implementation (which is not possible because, as
we said, the design system is a product, and if you want the

product to survive, it should constantly change and improve)

10. Run a sprint retrospective

All product teams should regularly schedule retrospective sprints
to assess progress and make required adjustments. Sprints can be
an excellent technique to ensure everyone on the team catches

things up easily.

ADOPT, ADAPT OR CREATE 295

---

## Seite 296

Tl. Test and refine
Test your design system with users to get feedback and identify
areas for improvement. Use this feedback to refine your design

system and ensure that it meets the needs of your users.

12. Document and maintain:
    Create documentation for your design system, including guidelines

and instructions for how to use it.

A design system is going to be ever-evolving. Continuously
maintain your design system by updating it as needed and

gathering feedback from stakeholders and users.

It should never be a blocker for a team; for example, what should
be done if there’s no specific component that the user needs? Look
for opportunities to simplify the processes so people can easily

onboard and contribute to the system.

Which approach to choose?

You might be questioning: is it better to create your design system
from scratch or adapt and customize an existing design system

that is created by someone else?

That depends on your resources, budget, needs for customization,

project, and business scale.

---

## Seite 297

“Create” is the choice for massive evolving projects and big
business names; who need custom solutions and high

differentiation from the market.

It can be beneficial if you want to establish a unique and distinct
brand identity for your work. It also gives you complete control over
the design system structure and elements, including the design
principles, guidelines, and components, how and where they are
built.

However, creating a design system from scratch can also be a
time-consuming and resource-intensive. Creating an effective and
efficient design system requires a lot of research, planning, and

testing.

“Adopt” and iteratively “Adapt” is the best solution for startups:
use already-made solutions, focus on solving actual problems,
create MVP, and test if your start-up idea is vital and worth more

investments.
“Adapt” can be a more efficient and cost-effective approach. It

allows to leverage the work that has already been done by others

and to build upon an existing framework.

ADOPT, ADAPT OR CREATE 297

---

## Seite 298

It's also important to consider the available resources and project
scope. For example, if the project has a tight deadline, it may be

more efficient to leverage an existing design system rather than
create one from scratch.

High cost, more Create - $$$$

customization, high \_
brand differentiation ¢

Cost

Less cost, Less da
customization a

-

Customisation and brand dufferentiation

ADOPT, ADAPT OR CREATE 298

---

## Seite 299

Key takeaways

- Adopting an existing design system requires research,
  understanding the system, auditing the current design,
  creating a plan, training the team, implementing, testing,

validating, monitoring and maintaining the system.

- Adapting an existing design system may means
  customizing elements of the branding, components,
  design guidelines, accessibility, responsiveness,
  interactions, don’t forget to test and validate the design
  system to make it fit your specific needs and

requirements.

- Creating a design system is an iterative process that
  takes time, effort and resources. It's important to be
  flexible and open to change as you work through the

Process.

- Which approach to choose? All options have their
  benefits and drawbacks, and the decision should be
  based on the project's specific requirements, needs and

resources available.

---

## Seite 300

=

Homework

- Choose one of the three approaches: adopt, adapt, or
  create. Explain why you chose that approach and how

you would go about implementing it in a design project.

- Provide specific examples and steps that you would

take to ensure a successful implementation.

- Think about advantages and challenges of your chosen

approach.

---

## Seite 301

Tips for freelancers

UI/UX designers can work as full-time employees or as freelancers.

Both have their own advantages and disadvantages, and the
choice between the two can depend on the individual's preference,

career goals, and lifestyle.

Design systems can play a crucial role in helping UI/UX designers
to work more efficiently, ensure consistency, improve their portfolio,

and enhance their competitiveness.
Q
Table of contents

- Freelance vs full-time.
- How can design systems help freelance designers?

- How to use design systems to improve your efficiency?

---

## Seite 302

Freelance vs full-time.

First of all, what the difference between a full-time UI/UX designer

and a freelance UI/UX designer?

It is the employment status. A full-time designer is employed by a
single company or organization on a permanent or long-term
basis, while a freelance designer is self-employed and works on a

project-by-project basis.

Full-time designers.

They typically have a more consistent workload and may work on
a variety of projects for their employer. They may have a more
structured schedule and work environment, and may be able to
take advantage of benefits and opportunities for career

advancement within the company.

Additionally, full-time designers may have more direct access to
the end-users of the product they are designing for and have more

opportunity to collaborate with other team members.

Freelance designers.

Freelance UI/UX designers, on the other hand, have more flexibility
in terms of the projects they work on, the clients they work with, and

their schedule. They can choose projects that align with their

---

## Seite 303

interests and skills and have the freedom to set their own rates.
They may also have the ability to work remotely, and have more

control over their work-life balance.

Both full-time and freelance UI/UX designers can be highly skilled
and successful in their field, it depends on the individual's

preference, career goals and lifestyle.

How design systems help?

Efficiency: Design systems can help freelance designers to work
more efficiently by providing them with a set of pre-designed and
tested components that they can use in their projects. This can
save a lot of time and effort that would have been spent designing

and testing new components from scratch.

Consistency: Using a design system can help freelance designers
to ensure consistency across different projects and clients. This
can be especially beneficial when working with multiple clients at
the same time, as it can be difficult to keep track of different design

guidelines and styles.

Portfolio: Having experience working with design systems can be a
valuable asset for freelance designers when looking for new clients
or projects. It demonstrates that they are familiar with industry best

practices and can work efficiently and effectively.

TIPS FOR FREELANCERS 303

---

## Seite 304

Learning: As a freelancer, you may not have the opportunity to
work with a team or in-house designers, with design systems you
can learn the best practices of different organizations and teams

and improve your own design skills.

Scalability: Design systems can help freelancers to scale their
services by providing them with a framework for designing and
developing consistent and cohesive user interfaces across

different platforms, devices, and screen sizes.

Competitive advantage: Design systems are becoming more
common, so having one in place can give a freelance designer a

competitive advantage over other freelancers who don't have one.

How to use design systems?

As a freelance designer, there are several things you can do with

design systems to enhance your work and improve your efficiency:

Adopt a design system: Use a design system that is already
established and adopted by the client or organization you are
working with. This will save you time and effort in creating design
guidelines and component s from scratch, and ensure consistency

with the rest of the organization's design.

---

## Seite 305

Create a design system: Create your own design system that you
can use for multiple projects and clients. This will save you time
and effort in the long run, as you can reuse components and

guidelines across different projects.

Customize a design system: Take an existing design system and
customize it to fit the specific needs of a particular project or client.
This can be a good way to tailor the design system to the unique
requirements of a project while still ensuring consistency with the

rest of the organization.

Use design system as a tool for communication with your clients
and stakeholders. It can help you to explain design decisions and

align expectations.

Learn and improve: Keep yourself updated with the best practices
and new trends in design systems and use them to improve your

own design skills.

---

## Seite 306

x

Key takeaways

- The choice between working as a full-time or freelance
  UI/UX designer is a personal one that depends on the

individual's preferences, goals, and lifestyle.

« Using design systems can help freelance designers to
work more efficiently, ensure consistency across
different projects and clients, improve the portfolio, learn
from different teams and organizations, improve design

skills and seale their services.

- Freelance UI/UX designers can adopt an existing design
  system, create their own, customize it, and use it as a tool

for all future projects.

- Keeping yourself updated with the latest trends and best
  practices in design systems can help you continuously

improve your design skills.

---

## Seite 307

=

- Research different design systems and choose one that

Homework

you think would be suitable for your work as a freelance
UI/UX designer.

Create your own design system by following industry
best practices and incorporating your own design

philosophy.

Customize an existing design system to fit the specific

needs of one of your projects or clients.

Use your design system as a tool for communicating
with clients and stakeholders, and explain the design

decisions you have made.

Keep yourself updated with the latest trends and best
practices in design systems by attending workshops,

reading articles, and participating in online communities.

---

## Seite 308

OUTRO
Final words

---

## Seite 309

You did it &

Congratulations on finishing the "Ul Design Systems Mastery"
ebook! You have taken an important step in gaining a deeper
understanding of design systems and how they can be used to

improve the efficiency and quality of your design work.

Design systems have become an essential tool for modern UI
design, and almost all solid companies have it in place; and by
mastering them, you will be able to create consistent, high-quality

designs that are easy to maintain and scale.

| hope that you found the book informative and helpful and that it
will serve as a valuable resource for your future design projects.

Feel free to come back to it anytime +

What’s next? &

Now take some time to reflect on what you've learned and think
about how you can apply it. Creating solid style guide and basic

components library can be a very good start!
Unfortunately, reading just one book is not enough. But that’s a very

a good beginning. Remember to keep learning, experimenting and

challenging yourself to improve your skills and knowledge.

FINAL WORDS 309

---

## Seite 310

More is coming!

There is still so much | would like to share! Keep an eye on your
emails and follow me on Instagram to stay updated on new

releases and bonuses.

If you have any questions or would like to see further explanations
on a particular chapter, dont hesitate to reach out to me. You can
send a direct message to ms.m.budarina@gmail.com or write me

on Instagram.

While the eBook provides a great foundation, there may be topics
youd like to learn more about in-depth. If | would try to go in-depth
about all topics, the work would never be finished and the ebook

would be infinite:)

That's why I'm considering creating further educational content;
And | need your help to determine the best format and topics.
Would you prefer an e-book, a masterclass, or a video course? And

what specific topics would you like to learn more about in depth?
Your feedback will help guide the creation of the content and
ensure it meets your needs. Share your thoughts and e-book

testimonial in the Google Form:

Click here to access a Google Form.

FINAL WORDS 310

---

## Seite 311

If you liked this ebook &

I've put a lot of time and effort into creating this eBook to make it

an enjoyable experience. If you found it helpful and valuable, |

would be incredibly grateful if you could take a moment to leave a

rating on Gumroad. Your support will help me continue to create

high-quality content for you. Thank you!

Click here to go on Gumroad and leave a rating

Let’s keep in touch ©

Even though we might not met yet, | truly appreciate your support
of my content. Don't hesitate to reach out and say “hello” on my
Instagram. | look forward to connecting with you and hearing

about your experiences with my eBook.

Take care and happy designing!

| send you my love and light '\*

FINAL WORDS

311
