A little parser combinator library for TypeScript loosely based off of [this paper][1] and very heavily inspired by Haskell packages; primarily [Parsec][2], [Megaparsec][4] and [Parser-Combinators][3], which are awesome.

I started working on this to learn more about parser combinators and how to implement monadic patterns in imperative languages. I liked the result so much I decided to share it, as I'm going to use it myself.

It's designed for readability and productivity, whilst being **as tiny as possible**. It's **not** designed for speed. I highly suggest you look into other solutions if speed is your main priority!

[1]: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/parsec-paper-letter.pdf
[2]: https://hackage.haskell.org/package/parsec
[3]: https://hackage.haskell.org/package/parser-combinators
[4]: https://hackage.haskell.org/package/megaparsec
