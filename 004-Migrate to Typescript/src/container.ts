import { Container } from 'inversify';
import BooksRepository from './models/BooksRepository';

const container = new Container();

container.bind(BooksRepository).toSelf();

export default container;
