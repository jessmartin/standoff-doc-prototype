<svelte:head>
  <title>Demo Page</title>
</svelte:head>

<article class="prose dark:prose-invert p-5">
  <h1>What I've Learned From Users</h1>

  <small>September 2022</small>
  <p>
    I recently told applicants to Y Combinator that the best advice I could give for getting in, per
    word, was
  </p>
  <blockquote>Explain what you've learned from users.</blockquote>
  <p>
    That tests a lot of things: whether you're paying attention to users, how well you understand
    them, and even how much they need what you're making.
  </p>
  <p>
    Afterward I asked myself the same question. What have I learned from YC's users, the startups
    we've funded?
  </p>
  <p>
    The first thing that came to mind was that most startups have the same problems. No two have
    exactly the same problems, but it's surprising how much the problems remain the same, regardless
    of what they're making. Once you've advised 100 startups all doing different things, you rarely
    encounter problems you haven't seen before.
  </p>
  <p>
    This fact is one of the things that makes YC work. But I didn't know it when we started YC. I
    only had a few data points: our own startup, and those started by friends. It was a surprise to
    me how often the same problems recur in different forms. Many later stage investors might never
    realize this, because later stage investors might not advise 100 startups in their whole career,
    but a YC partner will get this much experience in the first year or two.
  </p>
  <p>
    That's one advantage of funding large numbers of early stage companies rather than smaller
    numbers of later-stage ones. You get a lot of data. Not just because you're looking at more
    companies, but also because more goes wrong.
  </p>
  <p>
    But knowing (nearly) all the problems startups can encounter doesn't mean that advising them can
    be automated, or reduced to a formula. There's no substitute for individual office hours with a
    YC partner. Each startup is unique, which means they have to be advised by specific partners who
    know them well.
  </p>
  <p>
    We learned that the hard way, in the notorious "batch that broke YC" in the summer of 2012. Up
    till that point we treated the partners as a pool. When a startup requested office hours, they
    got the next available slot posted by any partner. That meant every partner had to know every
    startup. This worked fine up to 60 startups, but when the batch grew to 80, everything broke.
    The founders probably didn't realize anything was wrong, but the partners were confused and
    unhappy because halfway through the batch they still didn't know all the companies yet.
  </p>
  <p>
    At first I was puzzled. How could things be fine at 60 startups and broken at 80? It was only a
    third more. Then I realized what had happened. We were using an <i>O(n<sup>2</sup>)</i> algorithm.
    So of course it blew up.
  </p>
  <p>
    The solution we adopted was the classic one in these situations. We sharded the batch into
    smaller groups of startups, each overseen by a dedicated group of partners. That fixed the
    problem, and has worked fine ever since. But the batch that broke YC was a powerful
    demonstration of how individualized the process of advising startups has to be.
  </p>
  <p>
    Another related surprise is how bad founders can be at realizing what their problems are.
    Founders will sometimes come in to talk about some problem, and we'll discover another much
    bigger one in the course of the conversation. For example (and this case is all too common),
    founders will come in to talk about the difficulties they're having raising money, and after
    digging into their situation, it turns out the reason is that the company is doing badly, and
    investors can tell. Or founders will come in worried that they still haven't cracked the problem
    of user acquisition, and the reason turns out to be that their product isn't good enough. There
    have been times when I've asked "Would you use this yourself, if you hadn't built it?" and the
    founders, on thinking about it, said "No." Well, there's the reason you're having trouble
    getting users.
  </p>
  <p>
    Often founders know what their problems are, but not their relative importance. They'll come in
    to talk about three problems they're worrying about. One is of moderate importance, one doesn't
    matter at all, and one will kill the company if it isn't addressed immediately. It's like
    watching one of those horror movies where the heroine is deeply upset that her boyfriend cheated
    on her, and only mildly curious about the door that's mysteriously ajar. You want to say: never
    mind about your boyfriend, think about that door! Fortunately in office hours you can. So while
    startups still die with some regularity, it's rarely because they wandered into a room
    containing a murderer. The YC partners can warn them where the murderers are.
  </p>
</article>
