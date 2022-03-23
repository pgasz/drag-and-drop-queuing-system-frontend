function classDraggingElement(element) {
    element.addEventListener('dragstart', (e) => {
        element.classList.add('dragging');
        refreshDataOrder(element.dataset.queue_id);
    });
    element.addEventListener('dragend', (e) => {
        element.classList.remove('dragging');
        refreshDataOrder(element.dataset.queue_id);
    });
}

function getElementAfterDraggingElement(queue, yOfDraggingElement) {
    const queueElements = [
        ...queue.querySelectorAll('.element:not(.dragging)'),
    ];

    return queueElements.reduce(
        (closestElement, nextElement) => {
            let nextElementRectangle = nextElement.getBoundingClientRect();
            let offset =
                yOfDraggingElement -
                nextElementRectangle.top -
                nextElementRectangle.height / 2;

            if (offset < 0 && offset > closestElement.offset) {
                return { offset, element: nextElement };
            } else {
                return closestElement;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}
// function startfunction() {
function startfunction(data) {
    const queueContainer = document.getElementById('queueContainer');
    data.queues.forEach((queue) => {
        queueContainer.appendChild(
            createQueue(
                queue.id,
                queue.layout_order,
                queue.title,
                queue.elements
            )
        );
    });

    let elements = document.querySelectorAll('.element');
    let queues = document.querySelectorAll('.queue');

    elements.forEach((element) => {
        classDraggingElement(element);
    });

    queues.forEach((queue) => {
        queue.addEventListener(
            'dragover',
            (e) => {
                let draggingElement = document.querySelector('.dragging');
                let elementAfterDraggingElement =
                    getElementAfterDraggingElement(queue, e.clientY);
                if (elementAfterDraggingElement) {
                    draggingElement.setAttribute(
                        'data-queue_id',
                        queue.getAttribute('id')
                    );

                    elementAfterDraggingElement.parentNode.insertBefore(
                        draggingElement,
                        elementAfterDraggingElement
                    );
                } else {

                    draggingElement.setAttribute(
                        'data-queue_id',
                        queue.getAttribute('id')
                    );

                    queue.appendChild(draggingElement);
                }
            },
            false
        );
    });
}

function createElement(
    element_id,
    element_title,
    element_description,
    queue_id,
    order_inside_queue
) {
    const element = document.createElement('div');
    element.setAttribute('id', element_id);
    element.setAttribute('draggable', true);
    element.setAttribute('class', 'element');
    element.setAttribute('data-order', order_inside_queue);
    element.setAttribute('data-queue_id', queue_id);
    const elementTitle = document.createElement('div');
    elementTitle.setAttribute('class', 'elementTitle');
    elementTitle.innerText = element_title;
    const elementBody = document.createElement('div');
    elementBody.setAttribute('class', 'elementBody');
    elementBody.innerText = element_description;
    element.appendChild(elementTitle);
    element.appendChild(elementBody);
    return element;
}

function createQueue(queue_id, queue_order, queue_title, elements_list) {
    const queue = document.createElement('div');
    queue.setAttribute('id', queue_id);
    queue.setAttribute('class', 'queue');
    queue.style.order = queue_order;
    const queueTitle = document.createElement('div');
    queueTitle.setAttribute('class', 'queueTitle');
    queueTitle.innerText = queue_title;
    queue.appendChild(queueTitle);
    const draggingContainer = document.createElement('div');
    draggingContainer.setAttribute('class', 'draggingContainer');
    elements_list.forEach((element) => {
        draggingContainer.appendChild(
            createElement(
                element.id,
                element.title,
                element.body.description,
                queue_id,
                element.position
            )
        );
    });
    queue.appendChild(draggingContainer);
    return queue;
}

function refreshDataOrder(queue_id) {
    const queue = document.getElementById(queue_id);
    const queueElements = [
        ...queue.querySelectorAll('.element:not(.dragging)'),
    ];
    queueElements.forEach((element, index) => {
        element.dataset.order = index + 1;
    });
}

fetch('./static/data.json')
    .then((res) => res.json())
    .then((data) => startfunction(data));
