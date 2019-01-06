QUnit.test("handleData", assert => {
    const c = new Compsognathus();
    assert.throws(() => {
            c.handleData({});
        },
        "Throws an error when there are no items provided"
    );

    c.filterAndRender = () => {};

    const data = {
        items: [1, 2, 3]
    }
    c.handleData(data);
    assert.ok(
        c.source === data.items,
        "Sets data"
    );
});

QUnit.test("onCommentFilterInput", assert => {
    const c = new Compsognathus();
    let callCount = 0;
    c.filterAndRender = () => {callCount++};

    const event = {
        target: {
            value: "test"
        }
    }
    assert.ok(
        c.filters.comments === "",
        "Comments filter is empty by default"
    );
    // Called once
    c.onCommentFilterInput(event);
    assert.ok(
        c.filters.comments === "test",
        "Comments filter is set"
    );
    assert.ok(
        callCount === 1,
        "Render has been called once"
    );

    // Subsequent call with the same input
    c.onCommentFilterInput(event);
    assert.ok(
        c.filters.comments === "test",
        "Comments filter is unchanged"
    );
    assert.ok(
        callCount === 1,
        "Render has not been called twice"
    );
});

QUnit.test("onRatingFilterGroupClick", assert => {
    const c = new Compsognathus();
    const element = document.createElement("div");
    c.filterAndRender = () => {};

    const event = {
        target: element
    }
    assert.ok(
        c.filters.ratings.length === 0,
        "Ratings filter is empty by default"
    );

    element.dataset.rating = "3";
    c.onRatingFilterGroupClick(event);
    assert.ok(
        c.filters.ratings.indexOf(3) !== -1,
        "Ratings filter is set"
    );

    c.onRatingFilterGroupClick(event);
    assert.ok(
        c.filters.ratings.indexOf(3) === -1,
        "Ratings filter is unset"
    );
});

QUnit.test("filterAndRender", assert => {
    const c = new Compsognathus();
    let filterCount = 0;
    let renderCount = 0;
    c.filter = () => {filterCount++};
    c.render = () => {renderCount++};

    c.filterAndRender();

    assert.ok(
        filterCount === 1,
        "Filter has been called"
    );
    assert.ok(
        renderCount === 1,
        "Render has been called"
    );
});

QUnit.test("filter", assert => {
    const c = new Compsognathus();
    c.source = [
        {
            comment: "A",
            rating: 1
        },
        {
            comment: "A",
            rating: 2
        },
        {
            comment: "B",
            rating: 3
        }
    ]

    // No filters active
    c.filter();
    assert.ok(
        c.filteredData.length === 3,
        "No items are filtered out"
    );

    // Filtering by comment
    c.filters.comments = "a";
    c.filter();
    assert.ok(
        c.filteredData.length === 2,
        "One item is filtered out"
    );

    // Filtering by comment and rating
    c.filters.rarings = [1];
    c.filter();
    assert.ok(
        c.filteredData.length === 2,
        "One item is left"
    );
});
