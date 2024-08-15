A monadic parser combinator library for JavaScript and TypeScript, inspired by Haskell packages and designed to as **tiny** as it can be.

## Philosophy

Mothwing is designed to be as **tiny** as it can, and is inspired by Haskell packages such as [parsec][2], [megaparsec][3] and [parser-combinators][4]. It's loosely based off of [this paper][1].

It's designed to be as close to its Haskell inspirations as it can, exporting pure functions and avoiding class-like abstractions (such as chained method calls).

I created this package after struggling to feel comfortable using popular parser combinator packages on NPM.

[1]: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf
[2]: https://hackage.haskell.org/package/parsec
[3]: https://hackage.haskell.org/package/megaparsec
[4]: https://hackage.haskell.org/package/parser-combinators
