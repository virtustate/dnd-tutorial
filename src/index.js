import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
//import './index.css';
//import App from './App';
//import * as serviceWorker from './serviceWorker';
import initialData from './initial-data';
import Column from './column'

//const App = () => 'Hello world';

const Container = styled.div`
    display: flex;
`;

class InnerList extends React.PureComponent {
    render() {
        const {column,taskMap,index} =this.props;
        const tasks = column.taskIds.map(taskId => taskMap[taskId]);
        return <Column column={column} tasks={tasks} index={index}/>;
    }
}

class App extends React.Component {
    state = initialData;

    onDragStart = start => {
        document.body.style.color = 'orange';
        document.body.style.transition = 'background-color 0.2s ease';
        const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
        this.setState({ homeIndex, });
    }
    onDragUpdate = update => {
        const { destination } = update;
        const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0;
        document.body.style.backgroundColor = `rgba(153,141,217,${opacity})`
    };
    onDragEnd = result => {
        this.setState({ homeIndex: null, });
        document.body.style.color = 'inherit';
        document.body.style.backgroundColor = 'inherit';
        const { destination, source, draggableId,type } = result;
        if (!destination) { return; }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

if(type==='column') {
    const newColumnOrder=Array.from(this.state.columnOrder);
    newColumnOrder.splice(source.index,1);
    newColumnOrder.splice(destination.index,0,draggableId);
    const newState ={
        ...this.state,
        columnOrder: newColumnOrder
    };
    this.setState(newState);
    return;
}

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            const newColumn = {
                ...start, taskIds: newTaskIds,
            };
            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                }
            };
            this.setState(newState);
            return;
        }
        // moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };
        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };
        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        };
        this.setState(newState);
    };

    render() {
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
            >
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided,snapshot) => (
                        <Container {...provided.droppableProps} ref={provided.innerRef}>
                            {this.state.columnOrder.map((columnId, index) => {
                                const column = this.state.columns[columnId];
                                return <InnerList key={column.id} column={column} taskMap={this.state.tasks} index={index} />;
                            })}
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();


