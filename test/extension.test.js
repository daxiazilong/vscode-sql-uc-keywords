/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
const uckw = require('../uppercase-keywords');

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', function() {
    // Defines a Mocha unit test
    test('basic query', () => {
        assert.equal(uckw(`select * from test;`), `SELECT * FROM test;`);
    });
      
    test('ignores keywords in strings', () => {
        assert.equal(
            uckw(`select one, 'select in a string, a distinct case' from test;`), 
            `SELECT one, 'select in a string, a distinct case' FROM test;`
        );
    });
      
    test('advanced select', () => {
        const before = `
            select one, two, count(three), "distinct"
            from \`table\` as t1
            inner join table2 as t2 on t1.id = t2.foreign_key
            where t1.some_field <> 'something'
            group by t2.name
            order by t1.name
            limit 20
        `;
        const after = `
            SELECT one, two, count(three), "distinct"
            FROM \`table\` AS t1
            INNER JOIN table2 AS t2 ON t1.id = t2.foreign_key
            WHERE t1.some_field <> 'something'
            GROUP BY t2.name
            ORDER BY t1.name
            LIMIT 20
        `;
        assert.equal(uckw(before), after);
    });

    test('ignores comments', () => {
        assert.equal(
            uckw('/* select something */ drop table foo;'),
            '/* select something */ DROP TABLE foo;'
        );

        assert.equal(uckw(`
                select *
                from my_table -- between comment
                order by id
            `), `
                SELECT *
                FROM my_table -- between comment
                ORDER BY id
            `
        );

        assert.equal(uckw(`
                select *
                from my_table # on the way down
                order by id
            `), `
                SELECT *
                FROM my_table # on the way down
                ORDER BY id
            `
        );
    })
});

